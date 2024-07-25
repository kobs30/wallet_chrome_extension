import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import cn from 'classnames';

import * as t from 'global/types';
import { Button, ButtonSize } from 'components';
import { getTokenTypeImageSrc, getTokenSymbolImageSrc } from 'utils/token';
import { FAUCET_URL } from 'config';
import { Token } from 'global/stores/Token';
import { truncateAddress } from 'utils/address';
import { useRootStore } from 'core';

import styles from './TokenListItem.module.scss';

export type TokenListItemProps = {
  token: Token | t.Token;
  isHoverable?: boolean;
  displayDescription?: boolean;
  displayClaimButton?: boolean;
  onClick?(): void;
};

const TYPE_ICON_SISE = 12;

export const TokenListItem: FC<TokenListItemProps> = observer(function TokenListItem_(props) {
  const { isHoverable, token, displayDescription, displayClaimButton, onClick } = props;

  const rootStore = useRootStore();

  const isStore = token instanceof Token;
  const isNative = token.symbol === 'CYCL';

  const renderPrefix = () => {
    const symbolSrc = token.address
      ? getTokenSymbolImageSrc(token.address)
      : `/assets/images/tokens/${token.symbol.toLowerCase()}.png`;
    // const typeSrc = getTokenTypeImageSrc(token.type);
    const typeSrc = getTokenTypeImageSrc('CYCL');

    return (
      <div className={styles.images}>
        <img src={symbolSrc} alt={`${token.symbol} icon`} className={styles.symbol} />
        <div className={styles.type}>
          <img
            src={typeSrc}
            alt={`${token.type} type`}
            width={TYPE_ICON_SISE}
            height={TYPE_ICON_SISE}
          />
        </div>
      </div>
    );
  };

  const renderNativeBalance = () => {
    if (rootStore.tokens.isNativeLoading && rootStore.tokens.isNativeUninitialized) {
      return (
        <div className={styles.balances}>
          <div className={styles.balanceSkeleton} />
          <div className={styles.balanceSkeleton} />
        </div>
      );
    }
    return (
      <div className={styles.balances}>
        <div className={styles.balance}>{(token as any).balance.toFixed(2)}</div>
      </div>
    );
  };

  const renderBalances = () => {
    if (!isStore) return;

    if (token.isBalanceLoading) {
      return (
        <div className={styles.balances}>
          <div className={styles.balanceSkeleton} />
          <div className={styles.balanceSkeleton} />
        </div>
      );
    }

    return (
      <div className={styles.balances}>
        <div className={styles.balance}>{token.balance.toFixed(2)}</div>
        {/*<div className={styles.balanceInUsd}>$ 0.00</div>*/}
      </div>
    );
  };

  return (
    <div
      className={cn(styles.root, onClick && styles.clickable, isHoverable && styles.hoverable)}
      onClick={onClick}
    >
      {renderPrefix()}
      <div className={styles.content}>
        <div>
          <div className={styles.title}>{token.symbol}</div>
          <div className={styles.description}>
            {displayDescription ? token.description : truncateAddress(token.address)}
          </div>
        </div>
        {displayClaimButton ? (
          <Button
            size={ButtonSize.SMALL}
            className={styles.claimButton}
            onClick={() => window.open(FAUCET_URL)}
          >
            Claim
          </Button>
        ) : isNative ? (
          renderNativeBalance()
        ) : (
          renderBalances()
        )}
      </div>
    </div>
  );
});
