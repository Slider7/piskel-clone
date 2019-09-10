import { getSquareIndex } from '../utils/canvas-helpers';

test('getSquareIndex should return array', () => {
  expect(getSquareIndex(0, 0, 32)).toEqual({row: 0, col: 0});
});

