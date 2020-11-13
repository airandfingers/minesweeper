import { BoardSize, BoardState, RowState, CELL_CONTENTS } from './types'
import { getAdjacentIndexes } from './reducers'

const createBoardState = ({ width, height }: BoardSize): BoardState => {
  const boardState: BoardState = []
  for (let i = 0; i < height; i++) {
    const row: RowState = []
    boardState.push(row)
    for (let j = 0; j < width; j++) {
      row.push({ contents: CELL_CONTENTS.NEW })
    }
  }
  return boardState
}

/* beforeEach(() => {
  let boardState = createBoardState({ width: 5, height: 5 })
}) */

describe('getAdjacentIndexes', () => {
  test('calculates indexes adjacent to a position in the middle', () => {
    expect(getAdjacentIndexes({ rowNum: 2, colNum: 2 }, { width: 5, height: 5 }).length).toBe(8)
  });
  test('calculates indexes adjacent to a position on the top edge', () => {
    expect(getAdjacentIndexes({ rowNum: 0, colNum: 2 }, { width: 5, height: 5 }).length).toBe(5)
  });
  test('calculates indexes adjacent to a position at the top right corner', () => {
    expect(getAdjacentIndexes({ rowNum: 0, colNum: 4 }, { width: 5, height: 5 }).length).toBe(3)
  });
  test('calculates indexes adjacent to a position on the right edge', () => {
    expect(getAdjacentIndexes({ rowNum: 2, colNum: 4 }, { width: 5, height: 5 }).length).toBe(5)
  });
  test('calculates indexes adjacent to a position at the bottom right corner', () => {
    expect(getAdjacentIndexes({ rowNum: 4, colNum: 4 }, { width: 5, height: 5 }).length).toBe(3)
  });
  test('calculates indexes adjacent to a position on the bottom edge', () => {
    expect(getAdjacentIndexes({ rowNum: 4, colNum: 2 }, { width: 5, height: 5 }).length).toBe(5)
  });
  test('calculates indexes adjacent to a position at the bottom left corner', () => {
    expect(getAdjacentIndexes({ rowNum: 4, colNum: 0 }, { width: 5, height: 5 }).length).toBe(3)
  });
  test('calculates indexes adjacent to a position on the left edge', () => {
    expect(getAdjacentIndexes({ rowNum: 2, colNum: 0 }, { width: 5, height: 5 }).length).toBe(5)
  });
  test('calculates indexes adjacent to a position at the top left corner', () => {
    expect(getAdjacentIndexes({ rowNum: 0, colNum: 0 }, { width: 5, height: 5 }).length).toBe(3)
  });
  test('calculates no indexes adjacent to a cell in a 1x1 grid', () => {
    expect(getAdjacentIndexes({ rowNum: 0, colNum: 0 }, { width: 1, height: 1 }).length).toBe(0)
  });
  test('calculates 1 index adjacent to a cell in a 2x1 grid', () => {
    expect(getAdjacentIndexes({ rowNum: 0, colNum: 0 }, { width: 2, height: 1 }).length).toBe(1)
  });
  test('calculates 1 index adjacent to a cell in a 1x2 grid', () => {
    expect(getAdjacentIndexes({ rowNum: 1, colNum: 0 }, { width: 1, height: 2 }).length).toBe(1)
  });
})

