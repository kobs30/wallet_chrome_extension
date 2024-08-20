import { FC, useEffect, useState } from 'react';

import { CopyRounded } from '../icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip/Tooltip';
import styles from './CopyToClipboard.module.scss';

export type CopyToClipboardProps = {
  value: string;
  formatter?(value: string): string;
};

const TOOLTIP_OFFSET = 1;
const COPY_ICON_SIZE = 14;

export const CopyToClipboard: FC<CopyToClipboardProps> = (props) => {
  const { value, formatter } = props;

  const [isTooltipOpened, setIsTooltipOpened] = useState(false);

  useEffect(() => {
    if (isTooltipOpened) {
      const timeout = setTimeout(() => {
        setIsTooltipOpened(false);
      }, 2_000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isTooltipOpened]);

  const handleClick = () => {
    if (!window.isSecureContext) return;
    navigator.clipboard.writeText(value).catch((e) => {
      console.log('Error during copying error message', e);
    });
  };

  return (
    <Tooltip
      clickOnly
      offset={TOOLTIP_OFFSET}
      placement="bottom"
      open={isTooltipOpened}
      onOpenChange={() => setIsTooltipOpened(true)}
    >
      <TooltipTrigger className={styles.root} role="button" onClick={handleClick}>
        <CopyRounded width={COPY_ICON_SIZE} height={COPY_ICON_SIZE} />
        <span>{formatter?.(value)}</span>
      </TooltipTrigger>
      <TooltipContent>Copied!</TooltipContent>
    </Tooltip>
  );
};
