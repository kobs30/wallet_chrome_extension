import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageLayout } from 'layouts';
import { Send } from 'views';
import { IS_PLUGIN } from 'config';

import styles from './SendPage.module.scss';

const SEND_LS_KEY = 'send';

export const SendPage: FC = () => {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);

  const handleConfirmBack = () => setConfirm(false);

  const handleSubmit = () => setConfirm(true);

  const handleBack = async () => {
    navigate('/');
    try {
      await chrome.storage.session.remove(SEND_LS_KEY);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PageLayout
      isHeaderFixed={!IS_PLUGIN}
      back={confirm ? handleConfirmBack : handleBack}
      title={confirm ? 'Confirm Transaction' : 'Send'}
    >
      <div className={styles.root}>
        <Send
          confirm={confirm}
          onConfirmCancel={() => setConfirm(false)}
          onConfirm={handleBack}
          onSubmit={handleSubmit}
        />
      </div>
    </PageLayout>
  );
};
