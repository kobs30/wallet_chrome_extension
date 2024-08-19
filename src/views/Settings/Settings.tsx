import { FC, useState } from 'react';

import { TwoColumnFooter } from 'components';
import { CycloneSymbolOutlined } from 'components/icons/brand';
import { Coins, Globe, LockOpenOutlined, QuestionCircle, Wifi } from 'components/icons';
import { useRootStore } from 'core';

import styles from './Settings.module.scss';
import { SettingsLink, SettingsLinkProps } from './SettingsLink/SettingsLink';
import { pluralize } from '../../utils/textFormat';
import { DISCORD_URL, VERSION } from '../../config';

export const Settings: FC = () => {
  const [sitesCount, setSitesCount] = useState(0);
  const rootStore = useRootStore();
  const gateway = 'Cyclonchain.com';
  const feeToken = 'CYCL';

  chrome.storage.local.get('whitelist', function (params) {
    if (params?.whitelist && rootStore.wallet?.activeAddress) {
      const sites = params.whitelist[rootStore.wallet.activeAddress];
      setSitesCount(sites?.length || 0);
    } else {
      setSitesCount(0);
    }
  });

  const settingsLinks: SettingsLinkProps[] = [
    {
      icon: <Wifi />,
      pathname: '/settings/network-gateway',
      title: 'Network Gateway',
      description: gateway,
    },
    {
      icon: <LockOpenOutlined />,
      pathname: '/settings/change-password',
      title: 'Change Password',
      description: 'Your own chain',
    },
    {
      icon: <Globe />,
      pathname: '/settings/connected-sites',
      title: 'Connected Sites',
      description: pluralize(sitesCount, 'site'),
      disabled: !sitesCount ? true : false,
    },
    {
      icon: <Coins />,
      pathname: '/settings/fee-token',
      title: 'Fee Token',
      description: feeToken,
      disabled: true,
    },
  ];

  return (
    <div className={styles.root}>
      <div className={styles.links}>
        {settingsLinks.map((sl, index) => (
          <SettingsLink {...sl} key={index} />
        ))}
      </div>
      <TwoColumnFooter
        leftColumn={{ label: `Version ${VERSION}`, icon: <CycloneSymbolOutlined /> }}
        rightColumn={{
          label: 'Help',
          icon: <QuestionCircle />,
          onClick: () => window.open(DISCORD_URL),
        }}
      />
    </div>
  );
};
