import { ChangeEventHandler, FC, useState } from 'react';
import Fuse from 'fuse.js';
import { observer } from 'mobx-react-lite';

import { Chip, ChipSize, Input, InputSize } from 'components';
import { Search } from 'components/icons';
import { useRootStore } from 'core';
import { Token } from 'global/stores';

import styles from './SendFromSelect.module.scss';
import { SelectNativeListItem, SelectTokenListItem } from '../../common';

type ActiveTab = 'token' | 'nft';

export type SendFromSelectProps = {
  onListItemClick(address: string): void;
};

export const SendFromSelect: FC<SendFromSelectProps> = observer(function SendFromSelect_(props) {
  const { onListItemClick } = props;

  const rootStore = useRootStore();

  const [search, setSearch] = useState('');
  const [searchTokens, setSearchTokens] = useState<string[]>([]);
  const [, setActiveTab] = useState<ActiveTab>('token');

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

  const renderListItem = (item: Token) => {
    return <SelectTokenListItem token={item} />;
  };

  const renderList = () => {
    if (rootStore.tokens.noBalance) {
      return (
        <div
          style={{
            fontSize: 10,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.5,
          }}
        >
          No tokens available
        </div>
      );
    }

    return (
      <ul className={styles.list}>
        <li className={styles.listItem} onClick={() => onListItemClick('native')}>
          <SelectNativeListItem balance={rootStore.tokens.native} />
        </li>
        {[...rootStore.tokens.noFeeTokens]
          .sort((a, b) => b.balance - a.balance)
          .filter((value) => searchTokens.length === 0 || searchTokens.includes(value.symbol))
          .map((t) => (
            <li
              key={t.address}
              className={styles.listItem}
              onClick={() => onListItemClick(t.address)}
            >
              {renderListItem(t)}
            </li>
          ))}
      </ul>
    );
  };

  return (
    <div className={styles.root}>
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
      <div className={styles.tabs}>
        <Chip label="Tokens" size={ChipSize.SMALL} onClick={() => setActiveTab('token')} />
        <Chip label="NFTs" size={ChipSize.SMALL} onClick={() => setActiveTab('nft')} disabled />
      </div>
      <div className={styles.content}>{renderList()}</div>
    </div>
  );
});
