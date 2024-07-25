import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { PageLayout } from 'layouts';
import { IS_PLUGIN } from 'config';
import { GetStarted } from 'views';

import styles from './LoginPage.module.scss';
import { usePagesStore } from '../../PagesStore';

export const LoginPage: FC = observer(function LoginPage_() {
  const pagesStore = usePagesStore();

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <PageLayout
      back={IS_PLUGIN ? undefined : '/choice'}
      isHeaderOverlayActive={isSubmitting}
      title="Get Started"
    >
      <div className={styles.root}>
        <GetStarted
          onSubmitSuccess={(value) => {
            pagesStore.login.setImportPk(value);
            navigate('/login/new-account');
          }}
          onSubmittingChange={setIsSubmitting}
        />
      </div>
    </PageLayout>
  );
});
