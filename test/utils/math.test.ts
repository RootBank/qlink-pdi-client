import { add } from '../../src/utils/math';

describe('add function', () => {
  it('should return the sum of two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(add(-1, -1)).toBe(-2);
  });
});
