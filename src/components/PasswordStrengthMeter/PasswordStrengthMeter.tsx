import { CSSProperties, FC } from 'react';
import cn from 'classnames';

import styles from './PasswordStrengthMeter.module.scss';
import { getPasswordStrength } from './utils';
import { PasswordStrengthMeterStrength } from './types';

interface SegmentsCSSProperties extends CSSProperties {
  '--count': number;
}

interface SegmentCSSProperties extends CSSProperties {
  '--color': string;
}

export type PasswordStrengthMeterProps = {
  value: string;
};

const SEGMENTS_COUNT = 6;
const infoText = 'You can’t recover you password if you lose it!';
const weakText = 'Weak password, you can better!';
const mediumText = 'Good, this password is good enough!';
const strongText = 'Super, password looks strong!';

export const PasswordStrengthMeter: FC<PasswordStrengthMeterProps> = (props) => {
  const { value } = props;

  const configs: Record<PasswordStrengthMeterStrength, { text: string; color: string }> = {
    0: {
      text: infoText,
      color: '',
    },
    1: {
      text: weakText,
      color: 'var(--cc-color-pink)',
    },
    2: {
      text: weakText,
      color: 'var(--cc-color-pink)',
    },
    3: {
      text: mediumText,
      color: 'var(--cc-color-yellow)',
    },
    4: {
      text: mediumText,
      color: 'var(--cc-color-yellow)',
    },
    5: {
      text: strongText,
      color: 'var(--cc-color-green)',
    },
    6: {
      text: strongText,
      color: 'var(--cc-color-green)',
    },
  };

  const strength = getPasswordStrength(value);

  const config = configs[strength];

  return (
    <div className={styles.root}>
      <div
        className={styles.segments}
        style={{ '--count': SEGMENTS_COUNT } as SegmentsCSSProperties}
      >
        {new Array(SEGMENTS_COUNT).fill(undefined).map((_, index) => {
          const hasColor = index + 1 <= strength;
          return (
            <div
              className={cn(styles.segment, hasColor && styles.color)}
              style={
                {
                  '--color': hasColor ? config.color : undefined,
                } as SegmentCSSProperties
              }
              key={index}
            />
          );
        })}
      </div>
      <div className={styles.text}>{config.text}</div>
    </div>
  );
};
