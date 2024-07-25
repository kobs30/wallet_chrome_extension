import { FC } from 'react';

import { BrandIconProps } from './types';

export const CycloneSymbolColored: FC<BrandIconProps> = ({ width, height, className }) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 49 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient x1="1.086%" y1="53.591%" x2="66.7%" y2="18.064%" id="x1zci98pca">
          <stop stopColor="#ED1FFF" offset="0%" />
          <stop stopColor="#7867FC" offset="16.439%" />
          <stop stopColor="#46B5D4" offset="29.212%" />
          <stop stopColor="#24FCDC" offset="46.395%" />
          <stop stopColor="#52FA54" offset="82.08%" />
          <stop stopColor="#F5923C" offset="100%" />
        </linearGradient>
      </defs>
      <path
        d="M0 16C0 7.163 7.163 0 16 0c8.836 0 16 7.163 16 16H21.333a5.333 5.333 0 1 0-10.666 0 10.662 10.662 0 0 0 10.666 10.667A10.662 10.662 0 0 0 32 16h10.667c0 11.782-9.552 21.333-21.334 21.333S0 27.782 0 16z"
        transform="translate(3.167 5.333)"
        fill="url(#x1zci98pca)"
        fillRule="evenodd"
      />
    </svg>
  );
};
