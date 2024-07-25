import { FC } from 'react';

import { BrandIconProps } from './types';

export const MoreVert: FC<BrandIconProps> = ({ className, width, height }) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="2" transform="rotate(180 12 12)" fill="#B620E0" />
      <circle cx="12" cy="6" r="2" transform="rotate(180 12 6)" fill="#F7B500" />
      <circle cx="12" cy="18" r="2" transform="rotate(180 12 18)" fill="#32C5FF" />
    </svg>
  );
};
