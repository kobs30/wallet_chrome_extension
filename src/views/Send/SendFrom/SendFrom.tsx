import { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { observer } from 'mobx-react-lite';

import { getTokenSymbolImageSrc } from 'utils/token';
import { KeyboardArrowDown } from 'components/icons';
import { Dropdown } from 'components';
import { truncateAddress } from 'utils/address';
import { useRootStore } from 'core';

import styles from './SendFrom.module.scss';
import { SendFromSelect } from './SendFromSelect';
import { SendFormValues } from '../Send';
import { NoSymbol } from './NoSymbol';

export type SendFromProps = {
  token: {
    address: string;
    balance: number;
    symbol: string;
    type: string;
  };
};

const DROPDOWN_OFFSET = 2;
const TYPE_ICON_SIZE = 12;
const ARROW_ICON_SIZE = 16;

export const SendFrom: FC<SendFromProps> = observer(function SendFrom_(props) {
  const { token } = props;

  const rootStore = useRootStore();

  const formContext = useFormContext<SendFormValues>();

  const [isOpened, setIsOpened] = useState(false);

  const isNative = token.symbol === 'CYCL';

  const symbolSrc = isNative
    ? '/assets/images/tokens/cycl.png'
    : getTokenSymbolImageSrc(token.address);
  // const typeSrc = isNative
  //   ? '/assets/images/blockchains/cycl.png'
  //   : getTokenTypeImageSrc(token.type);
  const typeSrc = '/assets/images/blockchains/cycl.png';

  const handleClick = () => {
    void 0;
  };

  return (
    <Dropdown
      fullWidth
      offset={DROPDOWN_OFFSET}
      placement="bottom"
      open={isOpened}
      onOpenChange={setIsOpened}
      openerRender={(props) => (
        <div className={styles.root} onClick={handleClick} {...props}>
          <div className={styles.images}>
            {rootStore.tokens.noBalance ? (
              <NoSymbol />
            ) : (
              <img src={symbolSrc} className={styles.symbol} alt="icon" />
            )}
            <div className={styles.type}>
              <img src={typeSrc} width={TYPE_ICON_SIZE} height={TYPE_ICON_SIZE} alt="icon" />
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.row}>
              <div className={styles.title}>
                {rootStore.tokens.noBalance ? 'Select' : token.symbol}
              </div>
              <div className={styles.right}>
                <div className={styles.balance}>{token.balance.toFixed(2)}</div>
                <div className={styles.arrowIcon}>
                  <KeyboardArrowDown width={ARROW_ICON_SIZE} height={ARROW_ICON_SIZE} />
                </div>
              </div>
            </div>
            <div style={{ height: 12 }}>
              {token.address && (
                <div className={styles.description}>{truncateAddress(token.address)}</div>
              )}
            </div>
          </div>
        </div>
      )}
    >
      <SendFromSelect
        onListItemClick={(a) => {
          setIsOpened(false);
          formContext.setValue('token', a);
        }}
      />
    </Dropdown>
  );
});
