import { Link } from 'react-router-dom';

import chromeLogo from 'assets/images/chrome-logo.png';
import { TwoColumnFooter, GradientButton } from 'components';
import { CycloneSymbolColored, CycloneSymbolOutlineColored } from 'components/icons/brand';
import { Download, QuestionCircle } from 'components/icons';
import { CHROME_EXTENSION_URL, HELP_URL } from 'config';

import styles from './ChoicePage.module.scss';

const ICON_SIZE = 48;

export const ChoicePage = () => {
  return (
    <div className={styles.root}>
      <div>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.description}>First Decentralized Wallet</p>
      </div>
      <div className={styles.buttons}>
        <Link to="/login">
          <GradientButton>
            <div className={styles.gradientButton}>
              <CycloneSymbolOutlineColored width={ICON_SIZE} height={ICON_SIZE} />
              <div>
                <div className={styles.gradientButtonTitle}>Web Wallet</div>
                <div className={styles.gradientButtonDescription}>Use wallet in browser</div>
              </div>
            </div>
          </GradientButton>
        </Link>
        <GradientButton id="open">
          <div className={styles.gradientButton}>
            <div className={styles.symbol}>
              <CycloneSymbolColored width={ICON_SIZE} height={ICON_SIZE} />
              <div className={styles.chrome}>
                <img src={chromeLogo} alt="Chrome Logo" width={12} height={12} />
              </div>
            </div>
            <div>
              <div className={styles.gradientButtonTitle}>Chrome Extension</div>
              <div className={styles.gradientButtonDescription}>Use wallet in extension</div>
            </div>
          </div>
        </GradientButton>
      </div>
      <div className={styles.footer}>
        <TwoColumnFooter
          leftColumn={{
            icon: <QuestionCircle />,
            label: 'Get help',
            onClick: () => window.open(HELP_URL),
          }}
          rightColumn={{
            icon: <Download />,
            label: 'Download Extension',
            onClick: () => window.open(CHROME_EXTENSION_URL),
          }}
        />
      </div>
    </div>
  );
};
