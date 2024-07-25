import { ChangeEventHandler, FC, useState } from 'react';
import Fuse from 'fuse.js';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { Input, InputSize, Spinner } from 'components';
import { Search } from 'components/icons';
import { useRootStore } from 'core';

import { TokenListItem } from '../../common';
import styles from './TokensTab.module.scss';
import { FALLBACK_TOKEN } from '../constants';
import { IS_PLUGIN } from '../../../config';

export const TokensTab: FC = observer(function TokensTab_() {
  const rootStore = useRootStore();

  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [searchTokens, setSearchTokens] = useState<string[]>([]);

  const fuse = new Fuse(
    rootStore.tokens.tokens.map((t) => t.symbol),
    {
      useExtendedSearch: true,
    }
  );

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value);
    setSearchTokens(fuse.search(`'${e.target.value}`).map(({ item }) => item));
  };

  const renderTokens = () => {
    if (rootStore.tokens.isLoading && rootStore.tokens.isUninitialized) {
      return <Spinner />;
    }

    if (rootStore.tokens.noBalance) {
      return <TokenListItem token={FALLBACK_TOKEN} displayDescription displayClaimButton />;
    }

    return (
      <>
        <TokenListItem
          isHoverable
          token={{
            type: '',
            address: '',
            name: '',
            symbol: 'CYCL',
            description: '',
            balance: rootStore.tokens.native,
          }}
          onClick={() => navigate(`/send?symbol=native`)}
        />
        {rootStore.tokens.noFeeTokens
          .filter((value) => searchTokens.length === 0 || searchTokens.includes(value.symbol))
          .map((t) => (
            <TokenListItem
              isHoverable
              token={t}
              key={t.address}
              onClick={() => navigate(`/send?symbol=${t.symbol}`)}
            />
          ))}
      </>
    );
  };

  return (
    <div className={styles.root} style={{ height: IS_PLUGIN ? 344 : 196 }}>
      <div className={styles.input}>
        <Input
          value={search}
          onChange={handleSearchChange}
          onReset={() => setSearchTokens([])}
          size={InputSize.SMALL}
          placeholder="Search"
          prefix={<Search width={16} height={16} />}
          maxLength={32}
          allowClear
        />
      </div>
      <div className={styles.tokens}>{renderTokens()}</div>
    </div>
  );
});
