import { observer } from 'mobx-react-lite';
import { ChangeEventHandler, FC, useState } from 'react';
import Fuse from 'fuse.js';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import { Input, InputSize } from 'components';
import { Search, Wrench } from 'components/icons';
import { useRootStore } from 'core';

import styles from './FeeTokenSelect.module.scss';
import { SelectTokenListItem, SelectNativeListItem } from '../../common';

export type FeeTokenSelectProps = {
  onListItemClick(address: string): void;
};

const SEARCH_ICON_SIZE = 16;
const FEE_TOKEN_LINK_ICON_SIZE = 12;

export const FeeTokenSelect: FC<FeeTokenSelectProps> = observer(function FeeTokenSelect_(props) {
  const { onListItemClick } = props;

  const rootStore = useRootStore();

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
        {rootStore.tokens.noFeeTokens
          .filter((value) => searchTokens.length === 0 || searchTokens.includes(value.symbol))
          .map((t) => (
            <li
              key={t.address}
              className={styles.listItem}
              onClick={() => onListItemClick(t.address)}
            >
              <SelectTokenListItem token={t} />
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
          prefix={<Search width={SEARCH_ICON_SIZE} height={SEARCH_ICON_SIZE} />}
          maxLength={32}
          allowClear
        />
      </div>
      <div className={styles.links}>
        <Link to="/settings/fee-token" className={cn(styles.link, styles.disabled)}>
          <Wrench width={FEE_TOKEN_LINK_ICON_SIZE} height={FEE_TOKEN_LINK_ICON_SIZE} />
          <span>Fee settings</span>
        </Link>
      </div>
      <div className={styles.content}>{renderList()}</div>
    </div>
  );
});
