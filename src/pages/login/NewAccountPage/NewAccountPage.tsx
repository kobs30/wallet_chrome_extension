import { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { PageLayout } from 'layouts';
import { CreateAccount } from 'views';
import { CreateAccountStepConfig } from 'views/CreateAccount/types';

import styles from './NewAccountPage.module.scss';
import { usePagesStore } from '../../PagesStore';

export const NewAccountPage: FC = observer(function NewAccountPage_() {
  const pagesStore = usePagesStore();

  const navigate = useNavigate();

  const [stepConfig, setStepConfig] = useState<Pick<CreateAccountStepConfig, 'title' | 'back'>>({
    title: 'Create New Account',
    back: '/login',
  });

  return (
    <PageLayout title={stepConfig.title} back={stepConfig.back}>
      <div className={styles.root}>
        <CreateAccount
          onSubmitSuccess={() => {
            pagesStore.login.resetImportPk();
            navigate('/', { replace: true });
          }}
          importPk={pagesStore.login.importPk}
          onStepConfigChange={setStepConfig}
        />
      </div>
    </PageLayout>
  );
});
