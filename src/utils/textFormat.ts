export const truncateTextInMiddle = (value: string, max: number, separator?: string): string => {
  if (value.length <= max) return value;
  separator = separator || '…';
  const charsToShow = max - separator.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return value.slice(0, frontChars) + separator + value.slice(value.length - backChars);
};

export const pluralize = (count: number, noun: string): string => {
  return `${count} ${noun}${count !== 1 ? 's' : ''}`;
};
