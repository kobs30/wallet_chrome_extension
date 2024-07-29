import { FC, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageLayout } from 'layouts';
import { Send } from 'views';
import { IS_PLUGIN } from 'config';

import styles from './SendPage.module.scss';

const SEND_LS_KEY = 'send';

export const SendPage: FC = () => {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [requestData, setRequestData] = useState({});
  const sendTransactionListenerRef = useRef<any>(null);

  const handleConfirmBack = () => setConfirm(false);

  const handleSubmit = () => setConfirm(true);

  const handleBack = async () => {
    navigate('/');
    try {
      await chrome.storage.session.remove(SEND_LS_KEY);
    } catch (e) {
      /* empty */
    }
  };

  chrome.runtime.onMessage.addListener(async (request: any, sender: any, sendResponse: any) => {
    switch (request.action) {
      case 'SIGN_AND_SEND_TRANSACTION':
        setConfirm(true);
        setRequestData(request.data);
        sendResponse({ status: 'sign and send request success' });
        return true;
      case 'SEND_TRANSACTION':
        setConfirm(true);
        sendTransactionListenerRef.current = request.data;
        sendResponse({ status: 'send request success' });
        return true;
    }
  });

  return (
    <PageLayout
      isHeaderFixed={!IS_PLUGIN}
      back={confirm ? handleConfirmBack : handleBack}
      title={confirm ? 'Confirm Transaction' : 'Send'}
    >
      <div className={styles.root}>
        <Send
          requestData={requestData}
          confirm={confirm}
          onConfirmCancel={() => setConfirm(false)}
          onConfirm={handleBack}
          onSubmit={handleSubmit}
          sendTransactionListener={sendTransactionListenerRef.current}
        />
      </div>
    </PageLayout>
  );
};
