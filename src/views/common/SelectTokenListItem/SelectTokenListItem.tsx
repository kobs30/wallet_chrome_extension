import { FC } from 'react';

import { getTokenSymbolImageSrc } from 'utils/token';
import { Token } from 'global/stores';

import styles from './SelectTokenListItem.module.scss';

export type SelectTokenListItemProps = {
  token: Token;
};

const ICON_SIZE = 20;

export const SelectTokenListItem: FC<SelectTokenListItemProps> = (props) => {
  const { token } = props;

  const symbolSrc = getTokenSymbolImageSrc(token.address);

  return (
    <div className={styles.root}>
      <img src={symbolSrc} width={ICON_SIZE} height={ICON_SIZE} />
      <div className={styles.content}>
        <span className={styles.title}>{token.symbol}</span>
        <span className={styles.balance}>{token.balance.toFixed(2)}</span>
      </div>
    </div>
  );
};
