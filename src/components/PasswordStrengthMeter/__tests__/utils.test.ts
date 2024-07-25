import { describe, it, expect } from 'vitest';

import { getPasswordStrength } from '../utils';

describe('components/PasswordStrengthMeter/utils', () => {
  it('getPasswordStrength', () => {
    expect(getPasswordStrength('')).toBe(0);
    expect(getPasswordStrength('he')).toBe(1);
    expect(getPasswordStrength('hey')).toBe(1);
    expect(getPasswordStrength('Hey')).toBe(2);
    expect(getPasswordStrength('1')).toBe(2);
    expect(getPasswordStrength('123')).toBe(2);
    expect(getPasswordStrength('hey1')).toBe(2);
    expect(getPasswordStrength('heyhey')).toBe(2);
    expect(getPasswordStrength('heyHey')).toBe(3);
    expect(getPasswordStrength('heyheyhey')).toBe(3);
    expect(getPasswordStrength('hey123')).toBe(3);
    expect(getPasswordStrength('heyH23')).toBe(4);
    expect(getPasswordStrength('heyhey1HH')).toBe(5);
    expect(getPasswordStrength('1heyHEY!')).toBe(6);
  });
});
