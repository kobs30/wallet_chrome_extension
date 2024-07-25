import { FC } from 'react';

import { BrandIconProps } from './types';

export const Loading: FC<BrandIconProps> = ({ className, width, height }) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 32 32"
    >
      <defs>
        <linearGradient x1="100%" y1="0%" x2="0%" y2="100%" id="adu1s5byeb">
          <stop stopColor="#32C5FF" offset="0%" />
          <stop stopColor="#B620E0" offset="51.258%" />
          <stop stopColor="#F7B500" offset="100%" />
        </linearGradient>
        <rect id="24lmw3zeea" x="8" y="8" width="16" height="16" rx="8" />
        <mask
          id="zrx9jf03zc"
          maskContentUnits="userSpaceOnUse"
          maskUnits="objectBoundingBox"
          x="0"
          y="0"
          width="16"
          height="16"
          fill="#fff"
        >
          <use xlinkHref="#24lmw3zeea" />
        </mask>
      </defs>
      <use
        mask="url(#zrx9jf03zc)"
        xlinkHref="#24lmw3zeea"
        stroke="url(#adu1s5byeb)"
        strokeWidth="2"
        fill="none"
        fillRule="evenodd"
        strokeDasharray="13,10"
      />
    </svg>
  );
};
