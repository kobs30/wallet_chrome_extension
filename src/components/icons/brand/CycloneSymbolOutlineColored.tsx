import { FC } from 'react';

import { BrandIconProps } from './types';

export const CycloneSymbolOutlineColored: FC<BrandIconProps> = ({ className, width, height }) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient x1="1.086%" y1="53.591%" x2="66.7%" y2="18.064%" id="0hwaj1wzba">
          <stop stopColor="#ED1FFF" offset="0%" />
          <stop stopColor="#7867FC" offset="16.439%" />
          <stop stopColor="#46B5D4" offset="29.212%" />
          <stop stopColor="#24FCDC" offset="46.395%" />
          <stop stopColor="#52FA54" offset="82.08%" />
          <stop stopColor="#F5923C" offset="100%" />
        </linearGradient>
      </defs>
      <path
        d="M27.936 11.167a13.677 13.677 0 0 1-4.01 9.203 13.68 13.68 0 0 1-9.704 4.019 13.68 13.68 0 0 1-9.703-4.02A13.68 13.68 0 0 1 .5 10.668c0-2.808 1.138-5.35 2.978-7.19A10.135 10.135 0 0 1 10.667.5c2.807 0 5.349 1.138 7.189 2.978 1.73 1.73 2.839 4.08 2.965 6.689h-6.13a4.044 4.044 0 0 0-1.157-2.368 4.043 4.043 0 0 0-2.867-1.188c-1.12 0-2.134.454-2.868 1.188a4.043 4.043 0 0 0-1.188 2.868 7.608 7.608 0 0 0 7.611 7.61 7.61 7.61 0 0 0 7.595-7.11h6.119z"
        transform="translate(1.778 3.556)"
        stroke="url(#0hwaj1wzba)"
        fill="none"
        fillRule="evenodd"
      />
    </svg>
  );
};
