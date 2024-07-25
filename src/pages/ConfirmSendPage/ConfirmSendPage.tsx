import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageLayout } from 'layouts';
import { IS_PLUGIN } from 'config';
import { ConfirmSend } from 'views/Send/ConfirmSend/ConfirmSend';

import styles from './ConfirmSendPage.module.scss';

const SEND_LS_KEY = 'send';

export const ConfirmSendPage: FC = () => {
  const navigate = useNavigate();
  const handleBack = async () => {
    navigate('/');
    try {
      await chrome.storage.session.remove(SEND_LS_KEY);
    } catch (e) {
      /* empty */
    }
  };
  return (
    <PageLayout isHeaderFixed={!IS_PLUGIN} title="Confirm Transaction">
      <div className={styles.root}>
        <ConfirmSend onConfirm={handleBack} onCancel={handleBack} />
      </div>
    </PageLayout>
  );
};
