import { createPixelsArray } from '../utils/helpers';

test('return array length corresponds to input parameter = 1', () => {
  expect(createPixelsArray(1).length).toBe(1);
});

test('return array length corresponds to input parameter = 5', () => {
    expect(createPixelsArray(5).length).toBe(5);
  });

test('if input = 1, returns [["transparent"]]', () => {
    expect(createPixelsArray(1)).toEqual([['transparent']]);
  });

test('if input = N return N x N array of string "transparent"', () => {
    expect(createPixelsArray(2)).toEqual([['transparent', 'transparent'], ['transparent', 'transparent']]);
  });
