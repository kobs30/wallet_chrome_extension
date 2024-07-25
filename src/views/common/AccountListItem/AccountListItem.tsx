import { FC, MouseEventHandler, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Account } from 'global/stores/Account';
import { Done, EyeClose, MoreVert, OpenInNew, Texture } from 'components/icons';
import { MoreVert as MoreVertBrand } from 'components/icons/brand';
import {
  DropdownMenu,
  DropdownMenuListItem,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
  Dropdown,
  PrefixRect,
} from 'components';
import { truncateAddress } from 'utils/address';
import { useRootStore } from 'core';
import { WALLET_EXPLORER_URL } from 'config';

import { EditableName } from './EditableName/EditableName';
import styles from './AccountListItem.module.scss';

export type AccountListItemProps = {
  account: Account;
  displayMoreButton?: boolean;
};

const MORE_ICON_SIZE = 18;
const MORE_BUTTON_TOOLTIP_OFFSET = 5;

export const AccountListItem: FC<AccountListItemProps> = observer(function AccountListItem_(props) {
  const { account, displayMoreButton } = props;

  const rootStore = useRootStore();

  const navigate = useNavigate();

  const ref = useRef<HTMLDivElement>(null);

  const [isDropdownOpened, setIsDropdownOpened] = useState(false);

  const accountIndex = rootStore.wallet.findAccountIndexByAddress(account.address);
  const isActiveAccount = rootStore.wallet.isActiveAccount(account.address);

  const dropdownList: DropdownMenuListItem[] = [
    {
      label: 'Make primary',
      icon: <Done />,
      onClick: () => {
        rootStore.wallet.setActiveAddress(account.address);
        setIsDropdownOpened(false);
        navigate('/');
      },
    },
    {
      label: 'Acc Details & Key',
      icon: <Texture />,
      onClick: () => navigate(`/account-details/${account.address}`),
    },
    {
      label: 'View in Explorer',
      icon: <OpenInNew />,
      onClick: () => window.open([WALLET_EXPLORER_URL, account.address].join('#')),
    },
    {
      label: 'Hide account',
      icon: <EyeClose />,
      iconSize: 24,
      disabled: rootStore.wallet.accounts.length === 1,
      onClick: () => {
        rootStore.wallet.removeAccount(account.address);
        setIsDropdownOpened(false);
      },
    },
  ];

  const handleAccountChange: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    rootStore.wallet.setActiveAddress(account.address);
    navigate('/');
  };

  return (
    <div ref={ref} className={styles.root}>
      <div className={styles.prefixWrapper}>
        <PrefixRect
          className={styles.prefix}
          isActive={isActiveAccount}
          onClick={handleAccountChange}
        >
          <span className={styles.index}>{accountIndex + 1}</span>
        </PrefixRect>
      </div>
      <div className={styles.content}>
        <div className={styles.nameAndAddress}>
          <EditableName name={account.name} onSave={account.setName} />
          <div className={styles.address}>{truncateAddress(account.address)}</div>
        </div>
        {displayMoreButton && (
          <Dropdown
            offset={9}
            placement="bottom-end"
            open={isDropdownOpened}
            onOpenChange={setIsDropdownOpened}
            openerRender={(props, isOpened) => (
              <Tooltip offset={MORE_BUTTON_TOOLTIP_OFFSET} placement="top-end">
                <TooltipTrigger
                  {...props}
                  role="button"
                  className={styles.moreButton}
                  style={{ visibility: isOpened ? 'visible' : undefined }}
                >
                  {isOpened ? (
                    <MoreVertBrand width={MORE_ICON_SIZE} height={MORE_ICON_SIZE} />
                  ) : (
                    <MoreVert
                      width={MORE_ICON_SIZE}
                      height={MORE_ICON_SIZE}
                      style={{ opacity: 0.5 }}
                    />
                  )}
                </TooltipTrigger>
                <TooltipContent>More</TooltipContent>
              </Tooltip>
            )}
          >
            <DropdownMenu list={dropdownList} />
          </Dropdown>
        )}
      </div>
    </div>
  );
});
