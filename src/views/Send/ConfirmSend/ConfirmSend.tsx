import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'throttle-debounce';

import { ArrowDown, WalletOutlined } from 'components/icons';
import { truncateAddress } from 'utils/address';
import { truncateTextInMiddle } from 'utils/textFormat';
import { Button, ButtonVariant, Spinner } from 'components';
import { getTokenSymbolImageSrc } from 'utils/token';
import { useRootStore } from 'core';
import { usePagesStore } from 'pages';

import cStyles from './ConfirmSend.module.scss';
import styles from '../Send.module.scss';

type Props = {
  onCancel(): void;
  onConfirm(): void;
};

export const ConfirmSend = observer((props: Props) => {
  const { onCancel, onConfirm } = props;
  const rootStore = useRootStore();
  const pagesStore = usePagesStore();

  const [fee, setFee] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const updateFee = useCallback(debounce(200, setFee), []);

  useEffect(() => {
    if (!rootStore.transaction.webSend) return;
    rootStore.transaction.estimateFee(rootStore.transaction.webSend).then(updateFee);
  }, [rootStore.transaction.webSend]);

  if (!rootStore.transaction.webSend) return null;

  const token = { balance: rootStore.tokens.native, symbol: 'CYCL', address: '', type: '' };
  const feeToken = { symbol: 'CYCL', address: '' };
  const isMaxAmount = rootStore.transaction.webSend.amount === (token?.balance ?? 0);

  const symbolSrc = token
    ? token?.symbol === 'CYCL'
      ? '/assets/images/tokens/cycl.png'
      : getTokenSymbolImageSrc(token.address)
    : '';
  const typeSrc = '/assets/images/blockchains/cycl.png';

  const handleConfirm = async () => {
    setIsLoading(true);
    const values = rootStore.transaction.webSend;
    if (!values) return;
    try {
      const txHash = await rootStore.transaction.send({
        token: values.token,
        to: values.to,
        amount: isMaxAmount ? values.amount - fee : values.amount,
        signMessage: values.signMessage,
        feeCurrency: 'native',
      });
      rootStore.resetTokens();
      rootStore.transaction.resetWebSend();
      pagesStore.send.setTxHash(txHash);
      onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(cStyles.root, styles.confirm)}>
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
              <div className={styles.destinationTitle}>
                {truncateAddress(rootStore.transaction.webSend.to)}
              </div>
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
                {rootStore.transaction.webSend.amount} {token?.symbol}
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
                {isMaxAmount
                  ? rootStore.transaction.webSend.amount - fee
                  : rootStore.transaction.webSend.amount}{' '}
                {token?.symbol}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.confirmButtons}>
          <Button variant={ButtonVariant.SECONDARY} onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>{isLoading ? <Spinner /> : 'Confirm'}</Button>
        </div>
      </div>
    </div>
  );
});
