import { FC, useCallback, useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import cn from 'classnames';
import { debounce } from 'throttle-debounce';

import {
  Button,
  ButtonVariant,
  Dialog,
  DialogContent,
  DialogHeading,
  DialogTrigger,
  Dropdown,
  Input,
  InputNumber,
  OpenerRenderProps,
  Spinner,
  TextArea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'components';
import { useRootStore } from 'core';
import {
  ArrowDown,
  CommentNew,
  KeyboardArrowDown,
  QuestionCircle,
  WalletOutlined,
} from 'components/icons';
import { getTokenSymbolImageSrc } from 'utils/token';
import { HELP_URL, IS_PLUGIN } from 'config';
import { truncateTextInMiddle } from 'utils/textFormat';
import { truncateAddress } from 'utils/address';
import { usePagesStore } from 'pages';

import styles from './Send.module.scss';
import { SendFrom } from './SendFrom/SendFrom';
import { FeeTokenSelect } from './FeeTokenSelect/FeeTokenSelect';
import { validateAmount } from './utils';

export type SendProps = {
  confirm: boolean;
  requestData: object;
  sendTransactionListener: object | null;
  onConfirm(): void;
  onConfirmCancel(): void;
  onSubmit(): void;
};

export type SendFormValues = {
  token: string; // address
  to: string; // address
  amount: number;
  feeTokenAddress: string;
  feeTokenAmount: number;
  signMessage: string;
};

const SIGN_HELP_ICON_SIZE = 12;
const SIGN_BUTTON_ICON_SIZE = 16;
const SIGN_BUTTON_TOOLTIP_OFFSET = -4;
const FEE_TOKEN_PREFIX_ICON_SIZE = 16;
const FEE_TOKEN_SUFFIX_ICON_SIZE = 18;
const FEE_TOKEN_DROPDOWN_OFFSET = -34;

let feeAbortController = new AbortController();

export const Send: FC<SendProps> = observer(function Send_(props) {
  const { confirm, requestData, sendTransactionListener, onConfirmCancel, onConfirm, onSubmit } =
    props;

  const rootStore = useRootStore();
  const pagesStore = usePagesStore();

  const location = useLocation();
  const requestDataType = requestData as any;
  const currsendTransactionListenerType = sendTransactionListener as any;

  const [isFeeTokenSelectOpened, setIsFeeTokenSelectOpened] = useState(false);
  const [isSignDialogOpened, setIsDialogOpened] = useState(false);
  const [signMessage, setSignMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fee, setFee] = useState<number>(0);
  const [newSendTransactionListenerMessages, setNewsendTransactionListenerMessages] = useState({
    token: '',
    to: '',
    amount: 0,
    signMessage: '',
    feeCurrency: '',
  });

  useEffect(() => {
    if (sendTransactionListener) {
      const object = extractValues(currsendTransactionListenerType.message);
      setNewsendTransactionListenerMessages((prev) => ({
        ...prev,
        token: object?.token ?? '',
        to: object?.address,
        amount: object?.amount ? +object.amount / 100 : 0,
        feeCurrency: currsendTransactionListenerType.currencyFee,
      }));
    }
  }, [sendTransactionListener]);

  function extractValues(jsonString: string) {
    const parsedObject = JSON.parse(jsonString);
    const dataString = parsedObject.data;

    const regexTransfer = /transfer\("([^"]+)",\s*(\d+)\)/;
    const regexCallContract = /callContract\("([^"]+)",\s*"transfer",\s*"([^"]+)",\s*(\d+)\)/;

    let matches = dataString.match(regexTransfer);
    if (matches) {
      const address = matches[1];
      const amount = matches[2];
      return { address, amount };
    }

    matches = dataString.match(regexCallContract);
    if (matches) {
      const token = matches[1];
      const address = matches[2];
      const amount = matches[3];
      return { token, address, amount };
    }

    return null;
  }

  const getFormDefaultValues = (): SendFormValues => {
    const symbol = new URLSearchParams(location.search).get('symbol');
    const token =
      rootStore.tokens.noFeeTokens.find((t) => symbol === t.symbol)?.address ||
      requestDataType.token ||
      newSendTransactionListenerMessages.token ||
      'native';
    const defaultValue = {
      token,
      feeTokenAddress:
        requestDataType.feeCurrency || newSendTransactionListenerMessages.feeCurrency || 'native',
      feeTokenAmount: 0,
      amount: requestDataType.amount
        ? requestDataType.amount
        : newSendTransactionListenerMessages.amount
        ? newSendTransactionListenerMessages.amount
        : 0,
      signMessage: requestDataType.signMessage
        ? requestDataType.signMessage
        : newSendTransactionListenerMessages.signMessage
        ? newSendTransactionListenerMessages.signMessage
        : '',
      to: requestDataType.to
        ? requestDataType.to
        : newSendTransactionListenerMessages.to
        ? newSendTransactionListenerMessages.to
        : '',
    };

    return defaultValue;
  };

  const form = useForm<SendFormValues>({
    reValidateMode: 'onSubmit',
    defaultValues: getFormDefaultValues(),
  });

  const updateFee = useCallback(debounce(200, setFee), []);

  useEffect(() => {
    form.reset(getFormDefaultValues());
    setSignMessage(
      requestDataType.signMessage || newSendTransactionListenerMessages.signMessage || ''
    );
    console.log(form.getValues());
  }, [requestDataType, newSendTransactionListenerMessages]);

  useEffect(() => {
    const values = form.getValues();

    if (values.to?.length === 0 || values.amount === 0) return;

    feeAbortController.abort();
    feeAbortController = new AbortController();
    rootStore.transaction
      .estimateFee(
        {
          token: values.token,
          to: values.to,
          amount: values.amount,
          signMessage: values.signMessage,
          feeCurrency: values.feeTokenAddress,
        },
        feeAbortController.signal
      )
      .then(updateFee);

    return () => {
      feeAbortController.abort();
    };
  });

  useEffect(() => {
    form.watch((value) => {
      try {
        chrome.storage.session.set({ send: value }).catch(() => void 0);
      } catch (e) {
        /* empty */
      }
    });
  }, [form.watch]);

  useEffect(() => {
    rootStore.tokens.fetchNativeBalance().catch(() => void 0);
    rootStore.tokens.fetchTokens().then(() => {
      chrome.storage.session
        .get('send')
        .then(({ send }) => {
          form.reset(getFormDefaultValues());
          if (send.to) form.setValue('to', send.to);
          if (send.token) form.setValue('token', send.token);
          if (send.amount) form.setValue('amount', send.amount);
          if (send.signMessage) form.setValue('signMessage', send.signMessage);
          if (send.feeTokenAmount) form.setValue('feeTokenAmount', send.feeTokenAmount);
          if (send.feeTokenAddress) form.setValue('feeTokenAddress', send.feeTokenAddress);
        })
        .catch(() => {
          form.reset(getFormDefaultValues());
        });
    });

    return () => {
      setIsLoading(false);
    };
  }, []);

  const watchTo = form.watch('to');
  const watchToken = form.watch('token');
  const watchAmount = form.watch('amount');
  const watchFeeTokenAddress = form.watch('feeTokenAddress');

  if (rootStore.tokens.isLoading) return <Spinner />;
  if (rootStore.tokens.isError) return 'Error, Change network gateway';

  const token =
    watchToken === 'native'
      ? { balance: rootStore.tokens.native, symbol: 'CYCL', address: '', type: '' }
      : rootStore.tokens.findTokenByAddress(watchToken);
  const feeToken =
    watchFeeTokenAddress === 'native'
      ? { symbol: 'CYCL', address: '' }
      : rootStore.tokens.findTokenByAddress(watchFeeTokenAddress);
  const isFeeBalance =
    (watchFeeTokenAddress === 'native' && rootStore.tokens.native !== 0) ||
    rootStore.tokens.findTokenByAddress(watchFeeTokenAddress)?.balance !== 0;
  const isMaxAmount = watchAmount === (token?.balance ?? 0);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const values = form.getValues();

      const data = {
        token: values.token,
        to: values.to,
        amount: isMaxAmount ? values.amount - fee : values.amount,
        signMessage: values.signMessage,
        feeCurrency: values.feeTokenAddress,
      };

      const txHash = await rootStore.transaction.send(data);
      rootStore.resetTokens();
      pagesStore.send.setTxHash(txHash);
      onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  const toController = (
    <Controller
      name="to"
      control={form.control}
      rules={{ required: true, validate: rootStore.wallet.verifyAddress }}
      render={({ field: { onBlur, onChange, ref, value } }) => (
        <Input ref={ref} value={value} legend="Send to" onChange={onChange} onBlur={onBlur} />
      )}
    />
  );

  const amountController = (
    <Controller
      name="amount"
      control={form.control}
      rules={{
        min: 0,
        max: token?.balance ?? 0,
        required: true,
        validate: validateAmount,
      }}
      render={({ field: { onBlur, onChange, ref, value } }) => (
        <InputNumber
          ref={ref}
          value={value}
          legend="Amount"
          onChange={(e) => onChange(Number(e))}
          onBlur={onBlur}
          min={0}
          max={token?.balance}
        />
      )}
    />
  );

  const feeTokenPrefix = feeToken ? (
    <div className={styles.feeToken}>
      <img
        src={
          watchFeeTokenAddress === 'native'
            ? '/assets/images/tokens/cycl.png'
            : getTokenSymbolImageSrc(feeToken.address)
        }
        width={FEE_TOKEN_PREFIX_ICON_SIZE}
        height={FEE_TOKEN_PREFIX_ICON_SIZE}
        alt="icon"
      />
      <span className={styles.feeTokenSymbol}>{feeToken.symbol}</span>
    </div>
  ) : undefined;

  const feeTokenAmountController = ({ ref: openerRef, ...openerProps }: OpenerRenderProps) => (
    <div role="button" ref={openerRef} {...openerProps} className={styles.feeTokenDropdown}>
      <div className={styles.feeTokenLegend}>Fee Token</div>
      {feeTokenPrefix}
      <div className={styles.feeTokenText}>-{fee || ''}</div>
      <div className={styles.feeTokenArrow}>
        <KeyboardArrowDown width={FEE_TOKEN_SUFFIX_ICON_SIZE} height={FEE_TOKEN_SUFFIX_ICON_SIZE} />
      </div>
    </div>
  );

  const symbolSrc = token
    ? token?.symbol === 'CYCL'
      ? '/assets/images/tokens/cycl.png'
      : getTokenSymbolImageSrc(token.address)
    : '';
  const typeSrc = '/assets/images/blockchains/cycl.png';

  return (
    <FormProvider {...form}>
      <div className={styles.root}>
        {confirm ? (
          <div className={styles.confirm}>
            <img src={symbolSrc} alt="icon" className={styles.confirmSymbol} />
            <h1 className={styles.confirmTitle}>
              <img src={typeSrc} alt="type icon" width={12} height={12} />
              <span>{token?.symbol}</span>
            </h1>
            <div className={styles.confirmDestinations}>
              <div className={styles.confirmDestination}>
                <div className={styles.destinationPrefix}>
                  <WalletOutlined />
                  <img src={typeSrc} alt="type icon" className={styles.confirmType} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className={styles.destinationRow}>
                    <div className={styles.destinationTitle}>From</div>
                    <div className={styles.destinationTitle}>
                      {truncateAddress(rootStore.wallet.activeAddress)}
                    </div>
                  </div>
                  <div className={styles.destinationRow}>
                    <div className={styles.destinationHeadline}></div>
                    <div className={styles.destinationHeadline}>
                      {truncateTextInMiddle(rootStore.wallet.activeAccount.name, 18)}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.arrowRow}>
                <div className={styles.arrow}>
                  <div className={styles.arrowContent}>
                    <ArrowDown />
                  </div>
                </div>
              </div>
              <div className={styles.confirmDestination}>
                <div className={styles.destinationPrefix}>
                  <WalletOutlined />
                </div>
                <div style={{ flex: 1 }}>
                  <div className={styles.destinationRow}>
                    <div className={styles.destinationTitle}>To</div>
                    <div className={styles.destinationTitle}>{truncateAddress(watchTo)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.confirmSummary}>Transaction Summary</div>
            <div className={styles.summary}>
              <div className={styles.summaryContent}>
                <div className={styles.leaders}>
                  <div className={styles.leadersRow}>
                    <span className={styles.leadersTitle}>Asset</span>
                    <span className={styles.leadersValue}>{token?.symbol}</span>
                  </div>
                  <div className={styles.leadersRow}>
                    <span className={styles.leadersTitle}>Amount</span>
                    <span className={styles.leadersValue}>
                      {watchAmount} {token?.symbol}
                    </span>
                  </div>
                  <div className={styles.leadersRow}>
                    <span className={styles.leadersTitle}>Fee</span>
                    <span className={styles.leadersValue}>
                      -{fee} {feeToken?.symbol}
                    </span>
                  </div>
                  <div className={cn(styles.leadersRow, styles.tot)}>
                    <span className={styles.leadersTitle}>Total</span>
                    <span className={styles.leadersValue}>
                      {isMaxAmount ? watchAmount - fee : watchAmount} {token?.symbol}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.confirmButtons}>
                <Button variant={ButtonVariant.SECONDARY} onClick={onConfirmCancel}>
                  Cancel
                </Button>
                <Button onClick={handleConfirm}>{isLoading ? <Spinner /> : 'Confirm'}</Button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.top}>
              {token && <SendFrom token={token} />}
              <div className={styles.inputs}>
                {toController}
                {amountController}
                <Dropdown
                  fullWidth
                  offset={FEE_TOKEN_DROPDOWN_OFFSET}
                  placement="bottom"
                  open={isFeeTokenSelectOpened}
                  openerRender={feeTokenAmountController}
                  onOpenChange={setIsFeeTokenSelectOpened}
                >
                  <FeeTokenSelect
                    onListItemClick={(address) => {
                      form.setValue('feeTokenAddress', address, { shouldDirty: true });
                      setIsFeeTokenSelectOpened(false);
                    }}
                  />
                </Dropdown>
              </div>
            </div>
            <div className={styles.bottom} style={{ marginTop: IS_PLUGIN ? undefined : 16 }}>
              <div className={styles.total}>
                <span className={styles.totalTitle}>Total</span>
                <span className={styles.totalAmount}>
                  {isMaxAmount ? watchAmount - fee : watchAmount}{' '}
                  {!rootStore.tokens.noBalance && token?.symbol}
                </span>
                <Dialog open={isSignDialogOpened} onOpenChange={setIsDialogOpened}>
                  <DialogTrigger asChild>
                    <div className={styles.signFabWrapper}>
                      <Tooltip placement="left" offset={SIGN_BUTTON_TOOLTIP_OFFSET}>
                        <TooltipTrigger>
                          <div className={styles.signFab}>
                            <CommentNew
                              width={SIGN_BUTTON_ICON_SIZE}
                              height={SIGN_BUTTON_ICON_SIZE}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Sign transaction</TooltipContent>
                      </Tooltip>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeading title="Sign Transaction" />
                    <div className={styles.signDialogContent}>
                      <TextArea
                        rows={IS_PLUGIN ? 13 : 6}
                        legend="Your script"
                        placeholder="Here you can leave a comment on transaction or write a script for smart contract"
                        value={signMessage}
                        onChange={(e) => setSignMessage(e.target.value)}
                      />
                      <a href={HELP_URL} target="_blank" className={styles.signHelp}>
                        <QuestionCircle width={SIGN_HELP_ICON_SIZE} height={SIGN_HELP_ICON_SIZE} />
                        <span>How it works</span>
                      </a>
                    </div>
                    <Button
                      fullWidth
                      onClick={() => {
                        if (signMessage.length === 0) return;
                        form.setValue('signMessage', signMessage, { shouldDirty: true });
                        setIsDialogOpened(false);
                      }}
                    >
                      Sign Current Transaction
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
              <Button
                htmlType="submit"
                disabled={form.formState.isSubmitting || !form.formState.isDirty || !isFeeBalance}
              >
                Confirm & Send
              </Button>
            </div>
          </form>
        )}
      </div>
    </FormProvider>
  );
});
