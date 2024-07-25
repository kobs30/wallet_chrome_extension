import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import attention from 'assets/images/svg/attention.svg';
import { Button, DashBorderedBlock } from 'components';
import { useRootStore } from 'core';

import styles from './ResetCache.module.scss';

export const ResetCache: FC = observer(function ResetCache_() {
  const rootStore = useRootStore();

  const navigate = useNavigate();

  const handleClick = () => {
    rootStore.vault.removeAccounts();
    rootStore.wallet.reset();
    rootStore.network.resetNetwork();
    navigate('/login');
  };

  return (
    <div className={styles.root}>
      <div className={styles.attention}>
        <DashBorderedBlock>
          <img src={attention} alt="Attention Illustration" width={50} height={40} />
          <span className={styles.attentionTitle}>Don’t remember your password?</span>
          <p className={styles.attentionDescription}>
            Alas, no one in the world will be able to restore it. Before resetting the cache, try to
            remember the password again and again!
          </p>
        </DashBorderedBlock>
      </div>
      <div className={styles.content}>
        <div className={styles.info}>
          <h1 className={styles.title}>Remember Private key?</h1>
          <p className={styles.description}>
            If yes, you can use it to restore access after a reset.{' '}
            <span className={styles.pink}>If not, remember or everything is lost!</span>
          </p>
        </div>
        <Button style={{ '--color': 'var(--cc-color-pink)' }} onClick={handleClick}>
          Reset Cache
        </Button>
      </div>
    </div>
  );
});
