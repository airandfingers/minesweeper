import { BoardSize, Position, POSITION_VALUE, PositionInfo } from './types'
import { calculatePositionFromRowCol, calculateRowColFromPosition, getAdjacentPositions, generateMinePositions, calculatePositionInfos } from './utils'

const ONE_BY_ONE: BoardSize = { width: 1, height: 1 }
const ONE_BY_TWO: BoardSize = { width: 1, height: 2 }
const TWO_BY_ONE: BoardSize = { width: 2, height: 1 }
const THREE_BY_THREE: BoardSize = { width: 3, height: 3 }
const FIVE_BY_FIVE: BoardSize = { width: 5, height: 5 }
const THIRTY_BY_SIXTEEN: BoardSize = { width: 30, height: 16 }
const THOUSAND_BY_THOUSAND: BoardSize = { width: 1000, height: 1000 }

const calculatePositionFromRowColCases: [number, number, BoardSize, number, string][] = [
  // row, col, boardSize, expectedPosition, test name
  [0, 0, THIRTY_BY_SIXTEEN, 0, 'works for the top-left corner'],
  [0, 29, THIRTY_BY_SIXTEEN, 29, 'works for the top-right corner'],
  [1, 0, THIRTY_BY_SIXTEEN, 30, 'works for the second row'],
  [15, 29, THIRTY_BY_SIXTEEN, 479, 'works for the bottom-right corner'],
  [0, 0, ONE_BY_ONE, 0, 'works for a 1x1 board'],
  [1, 0, ONE_BY_TWO, 1, 'works for a 1x2 board'],
  [500, 500, THOUSAND_BY_THOUSAND, 500500, 'works for a 1000x1000 board']
]
describe('calculatePositionFromRowCol', () => {
  calculatePositionFromRowColCases.forEach(([row, col, boardSize, expectedPosition, name]) => {
    test(name, () => {
      expect(calculatePositionFromRowCol(row, col, boardSize)).toBe(expectedPosition)
    })
  })
})
describe('calculateRowColFromPosition', () => {
  calculatePositionFromRowColCases.forEach(([rowNum, colNum, boardSize, position, name]) => {
    test(name, () => {
      expect(calculateRowColFromPosition(position, boardSize)).toStrictEqual({ rowNum, colNum })
    })
  })
})

const getAdjacentPositionsCases: [number, BoardSize, number, string][] = [
  // position, boardSize, expectedLength, test name
  [12, FIVE_BY_FIVE, 8, 'calculates positions adjacent to a position in the middle'],
  [2, FIVE_BY_FIVE, 5, 'calculates positions adjacent to a position on the top edge'],
  [4, FIVE_BY_FIVE, 3, 'calculates positions adjacent to a position at the top right corner'],
  [14, FIVE_BY_FIVE, 5, 'calculates positions adjacent to a position on the right edge'],
  [24, FIVE_BY_FIVE, 3, 'calculates positions adjacent to a position at the bottom right corner'],
  [22, FIVE_BY_FIVE, 5, 'calculates positions adjacent to a position on the bottom edge'],
  [20, FIVE_BY_FIVE, 3, 'calculates positions adjacent to a position at the bottom left corner'],
  [10, FIVE_BY_FIVE, 5, 'calculates positions adjacent to a position on the left edge'],
  [0, FIVE_BY_FIVE, 3, 'calculates positions adjacent to a position at the top left corner'],
  [0, ONE_BY_ONE, 0, 'calculates no positions adjacent to a cell in a 1x1 board'],
  [0, TWO_BY_ONE, 1, 'calculates 1 position adjacent to a cell in a 2x1 board'],
  [1, ONE_BY_TWO, 1, 'calculates 1 position adjacent to a cell in a 1x2 board'],
  [500500, THOUSAND_BY_THOUSAND, 8, 'calculates 8 positions adjacent to a cell in the middle of a 1000x1000 board']
]
describe('getAdjacentPositions', () => {
  getAdjacentPositionsCases.forEach(([position, boardSize, expectedLength, name]) => {
    test(name, () => {
      expect(getAdjacentPositions(position, boardSize).length).toBe(expectedLength)
    })
  })
})

const generateMinePositionsCases: [BoardSize, number, Position, number, string][] = [
  // boardSize, numMines, firstPosition, expectedSize, test name
  [FIVE_BY_FIVE, 10, 0, 10, 'generates 10 mines in a 5x5 board'],
  [FIVE_BY_FIVE, 20, 5, 20, 'generates 20 mines in a 5x5 board'],
   [FIVE_BY_FIVE, 0, 10, 0, 'generates 0 mines in a 5x5 board'],
  [FIVE_BY_FIVE, 25, 24, 24, 'generates 24 mines instead of 25 in a 5x5 board'],
  [FIVE_BY_FIVE, 50, 24, 24, 'generates 24 mines instead of 50 in a 5x5 board'],
  [ONE_BY_ONE, 1, 0, 0, 'generates 0 mines instead of 1 in a 1x1 board'],
  [ONE_BY_TWO, 1, 0, 1, 'generates 1 mine in a 1x2 board'],
  [ONE_BY_TWO, 2, 0, 1, 'generates 1 mine instead of 2 in a 1x2 board'],
  [THOUSAND_BY_THOUSAND, 500000, 0, 500000, 'generates 500000 mines in a 1000x1000 board'],
  [THOUSAND_BY_THOUSAND, 1000000, 0, 999999, 'generates 999999 mines instead of 1000000 in a 1000x1000 board']
]
describe('generateMinePositions', () => {
  generateMinePositionsCases.forEach(([boardSize, numMines, firstPosition, expectedSize, name]) => {
    test(name, () => {
      expect(generateMinePositions(boardSize, numMines, firstPosition).size).toBe(expectedSize)
    })
  })
  test('It does not generate a mine at firstPosition (25 mines, 5x5 board)', () => {
    expect(generateMinePositions(FIVE_BY_FIVE, 25, 10).has(10)).toBe(false)
  })
})

const MINE = { value: POSITION_VALUE.MINE }
const calculatePositionInfosCases: [BoardSize, Set<number>, PositionInfo[], string][] = [
  // boardSize, minePositions, objectToMatch, test name
  [ONE_BY_ONE, new Set<number>(), [{ value: POSITION_VALUE.EMPTY, adjacentPositions: [] }], 'calculates the correct position info for a 1x1 board with no mines'],
  [ONE_BY_TWO, new Set([0]), [ MINE, { value: POSITION_VALUE.ONE, adjacentPositions: [0] }], 'calculates the correct position info for a 1x2 board with 1 mine'],
  [ONE_BY_TWO, new Set<number>(), [{ value: POSITION_VALUE.EMPTY, adjacentPositions: [1] }, { value: POSITION_VALUE.EMPTY, adjacentPositions: [0] }], 'calculates the correct position info for a 1x2 board with no mines'],
  [TWO_BY_ONE, new Set([1]), [{ value: POSITION_VALUE.ONE, adjacentPositions: [1] }, MINE], 'calculates the correct position info for a 2x1 board with 1 mine'],
  [TWO_BY_ONE, new Set<number>(), [{ value: POSITION_VALUE.EMPTY, adjacentPositions: [1] }, { value: POSITION_VALUE.EMPTY, adjacentPositions: [0] }], 'calculates the correct position info for a 2x1 board with no mines'],
  [THREE_BY_THREE, new Set([0, 1, 2, 3, 5, 6, 7, 8]), [MINE, MINE, MINE, MINE, { value: POSITION_VALUE.EIGHT, adjacentPositions: [0, 1, 2, 3, 5, 6, 7, 8] }, MINE, MINE, MINE, MINE], 'calculates the correct position info for a 2x1 board with 8 mines']
]
describe('calculatePositionInfos', () => {
  calculatePositionInfosCases.forEach(([boardSize, minePositions, objectToMatch, name]) => {
    test(name, () => {
      expect(calculatePositionInfos(boardSize, minePositions)).toMatchObject(objectToMatch)
    })
  })
})