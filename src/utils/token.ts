import { NETWORK_URL } from 'config';

export const getTokenSymbolImageSrc = (address: string): string => {
  // return `/assets/images/tokens/${value.toLowerCase()}.png`;
  return `${NETWORK_URL}/wallet_approved_tokens/${address}.png`;
};

export const getTokenTypeImageSrc = (value: string): string => {
  return `/assets/images/blockchains/${value.toLowerCase()}.png`;
};
