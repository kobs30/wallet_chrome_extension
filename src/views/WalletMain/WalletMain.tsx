import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tab } from 'rc-tabs/lib/interface';
import { observer } from 'mobx-react-lite';
import useInterval from 'ahooks/lib/useInterval';

import {
  ArrowForward,
  CogwheelOutlined,
  Explorer,
  LockOpenOutlined,
  MoreVert,
  OpenInNew,
  SwapHoriz,
  Texture,
  UnpinOutlined,
  UploadNew,
  Wallet,
} from 'components/icons';
import { Dropdown, DropdownMenu, DropdownMenuListItem, Tabs, TwoColumnFooter } from 'components';
import { CycloneLogoWhite } from 'components/icons/brand';
import { WALLET_EXPLORER_URL, FAUCET_URL, IS_PLUGIN } from 'config';
import { useRootStore } from 'core';

import styles from './WalletMain.module.scss';
import { ActionButton } from './ActionButton/ActionButton';
import { TokensTab } from './TokensTab/TokensTab';
import { BottomNavigation } from './BottomNavigation/BottomNavigation';

const EXPLORER_ICON_SIZE = 20;

export const WalletMain: FC = observer(function WalletMain_() {
  const rootStore = useRootStore();

  const navigate = useNavigate();

  useInterval(() => {
    if (rootStore.vault.password && rootStore.wallet.accounts.length !== 0) {
      rootStore.tokens.fetchTokens().catch(() => void 0);
      rootStore.tokens.fetchNativeBalance().catch(() => void 0);
    }
  }, 5000);

  useEffect(() => {
    rootStore.tokens.fetchTokens().catch(() => void 0);
    rootStore.tokens.fetchNativeBalance().catch(() => void 0);
  }, []);

  const moreButtonDropdownList: DropdownMenuListItem[] = [
    {
      label: 'Acc Details & Key',
      icon: <Texture />,
      onClick: () => navigate(`/account-details/${rootStore.wallet.activeAccount.address}`),
    },
    {
      label: 'View in Explorer',
      icon: <OpenInNew />,
      onClick: () =>
        window.open([WALLET_EXPLORER_URL, rootStore.wallet.activeAccount.address].join('#')),
    },
    { divider: true },
    { label: 'Settings', icon: <CogwheelOutlined />, onClick: () => navigate('/settings') },
    { label: 'Unpin window', icon: <UnpinOutlined />, onClick: () => void 0, disabled: true },
    {
      label: 'Close & Lock',
      icon: <LockOpenOutlined />,
      onClick: async () => {
        await rootStore.vault.setLocked();
        window.close();
      },
    },
  ];

  const tabs: Tab[] = [
    {
      label: 'Tokens',
      key: 'tokens',
      children: (
        <div className={styles.tab}>
          <TokensTab />
        </div>
      ),
    },
    { label: 'NFTs', key: 'nfts', children: 'NFTs', disabled: true },
    { label: 'Activity', key: 'activity', children: 'Activity', disabled: true },
  ];

  return (
    <div className={styles.root}>
      <div className={styles.actions}>
        <ActionButton label="Send" icon={<ArrowForward />} onClick={() => navigate('/send')} />
        <ActionButton label="Swap" icon={<SwapHoriz />} disabled onClick={() => void 0} />
        <Dropdown
          offset={1}
          placement="bottom-end"
          openerRender={(props) => <ActionButton {...props} label="More" icon={<MoreVert />} />}
        >
          <DropdownMenu list={moreButtonDropdownList} />
        </Dropdown>
      </div>
      <div className={styles.content}>
        <div className={styles.tabsContent}>
          <Tabs items={tabs} className={styles.tabs} />
        </div>
        <div>
          <TwoColumnFooter
            leftColumn={{ label: 'Import Token', icon: <UploadNew />, disabled: true }}
          />
          {IS_PLUGIN && (
            <div className={styles.bottomNavigation}>
              <BottomNavigation
                activeTab="wallet"
                tabs={[
                  {
                    label: 'Faucet',
                    value: 'faucet',
                    icon: <CycloneLogoWhite />,
                    onClick: () => window.open(FAUCET_URL),
                  },
                  { label: 'Wallet', value: 'wallet', icon: <Wallet /> },
                  {
                    label: 'Explorer',
                    value: 'explorer',
                    icon: <Explorer width={EXPLORER_ICON_SIZE} height={EXPLORER_ICON_SIZE} />,
                    onClick: () =>
                      window.open(
                        [WALLET_EXPLORER_URL, rootStore.wallet.activeAccount.address].join('#')
                      ),
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
