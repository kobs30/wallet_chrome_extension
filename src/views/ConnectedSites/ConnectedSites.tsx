import { FC, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';

import { Button } from 'components';
import { useRootStore } from 'core';
import { OpenInNew } from 'components/icons';

import styles from './ConnectedSites.module.scss';
import moreIcon from '../../assets/images/svg/moreConnectedSites.svg';

export type ConnectedSitesFormValues = {
  oldPassword: string;
  newPassword: string;
  repeatNewPassword: string;
};

export type ConnectedSitesProps = {
  onSubmitSuccess(): void;
};

type SiteItem = {
  url: string;
  state: boolean;
};

export const ConnectedSites: FC<ConnectedSitesProps> = observer(function ConnectedSites_(props) {
  const { onSubmitSuccess } = props;
  const [sitesList, setSitesList] = useState<SiteItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const disconnectRef = useRef<HTMLDivElement | null>(null);
  const moreIconRef = useRef<HTMLImageElement | null>(null);

  const rootStore = useRootStore();

  const form = useForm<ConnectedSitesFormValues>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    },
  });

  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      chrome.storage.local.get('whitelist', function (params) {
        const list = params.whitelist[rootStore.wallet.activeAddress] || [];
        setSitesList(list);

        const initialCheckedItems = list.reduce(
          (acc: { [key: string]: boolean }, item: SiteItem) => {
            acc[item.url] = item.state;
            return acc;
          },
          {}
        );
        setCheckedItems(initialCheckedItems);
        isInitialized.current = true;
      });
    }
  }, [rootStore.wallet.activeAddress]);

  const handleSubmit = async () => {
    onSubmitSuccess();
  };

  const handleDisconnectClick = (url: string) => {
    const updatedSitesList = sitesList.filter((item) => item.url !== url);

    setSitesList(updatedSitesList);
    setActiveIndex(null);

    chrome.storage.local.get('whitelist', function (params) {
      const whitelist = params.whitelist || {};
      whitelist[rootStore.wallet.activeAddress] = updatedSitesList;
      chrome.storage.local.set({ whitelist });
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        disconnectRef.current &&
        !disconnectRef.current.contains(event.target as Node) &&
        moreIconRef.current &&
        !moreIconRef.current.contains(event.target as Node)
      ) {
        setActiveIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleCheckbox = (url: string) => {
    setCheckedItems((prev) => {
      const updatedCheckedItems = {
        ...prev,
        [url]: !prev[url],
      };

      const updatedSitesList = sitesList.map((item) =>
        item.url === url ? { ...item, state: updatedCheckedItems[url] } : item
      );

      setSitesList(updatedSitesList);

      chrome.storage.local.get('whitelist', function (params) {
        const whitelist = params.whitelist || {};
        whitelist[rootStore.wallet.activeAddress] = updatedSitesList;
        chrome.storage.local.set({ whitelist });
      });

      return updatedCheckedItems;
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.root}>
      <ul className={styles.sitesList}>
        {sitesList?.map((item) => (
          <li key={item.url} className={styles.site}>
            <div className={styles.serialNumber}>
              <span>{sitesList.indexOf(item) + 1}</span>
              <div
                className={`${styles.checkbox} ${checkedItems[item.url] ? styles.checked : ''}`}
                onClick={() => toggleCheckbox(item.url)}
              >
                {checkedItems[item.url] && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    focusable="false"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M9.00016 16.17L4.83016 12L3.41016 13.41L9.00016 19L21.0002 6.99997L19.5902 5.58997L9.00016 16.17Z"></path>
                  </svg>
                )}
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.title}>
                <p className={styles.hostname}>{item && item.url && new URL(item.url).host}</p>
                <span>Auto confirmation of transactions</span>
              </div>
              <div className={styles.more}>
                <img
                  src={moreIcon}
                  alt="moreIcon"
                  onClick={() => setActiveIndex(item.url)}
                  className={styles.moreIcon}
                  ref={moreIconRef}
                />
                <span className={styles.moreTooltip}>More</span>
                {activeIndex === item.url && (
                  <div
                    ref={disconnectRef}
                    className={styles.disconnect}
                    style={{ display: 'flex' }}
                    onClick={() => handleDisconnectClick(item.url)}
                  >
                    <div>
                      <OpenInNew />
                      <p>Disconnect</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.confirmBtnWrap}>
        <Button htmlType="submit" fullWidth>
          Ok
        </Button>
      </div>
    </form>
  );
});
