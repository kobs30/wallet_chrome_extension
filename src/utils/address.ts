import { truncateTextInMiddle } from 'utils/textFormat';

export const truncateAddress = (address: string): string => {
  return truncateTextInMiddle(address, 14);
};
