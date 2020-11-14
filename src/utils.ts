import { BoardState, POSITION_VALUE, PositionInfo, BoardSize, Position } from './types'

export const copyBoardState = (boardState: BoardState) =>
  boardState.map((cell) => ({ contents: cell.contents }))

export const NUM_ADJACENT_MINES_TO_POSITION_VALUE = [
  POSITION_VALUE.EMPTY,
  POSITION_VALUE.ONE,
  POSITION_VALUE.TWO,
  POSITION_VALUE.THREE,
  POSITION_VALUE.FOUR,
  POSITION_VALUE.FIVE,
  POSITION_VALUE.SIX,
  POSITION_VALUE.SEVEN,
  POSITION_VALUE.EIGHT,
]

export const calculatePositionFromRowCol = (rowNum: number, colNum: number, { width }: BoardSize): Position => rowNum * width + colNum

export const calculateRowColFromPosition = (position: Position, { width }: BoardSize): { rowNum: number, colNum: number } => ({
  rowNum: ~~(position / width), // ~~ = Math.floor
  colNum: position % width
})

export const getAdjacentPositions = (position: Position, { width, height }: BoardSize): Position[] => {
  const { rowNum, colNum } = calculateRowColFromPosition(position, { width, height })
  const edges = {
    left: colNum === 0,
    top: rowNum === 0,
    right: colNum === width - 1,
    bottom: rowNum === height - 1
  }
  const adjacentPositions: Position[] = []
  if (!edges.top) {
    if (!edges.left) {
      adjacentPositions.push(position - width - 1)
    }
    adjacentPositions.push(position - width)
    if (!edges.right) {
      adjacentPositions.push(position - width + 1)
    }
  }
  if (!edges.left) {
    adjacentPositions.push(position - 1)
  }
  if (!edges.right) {
    adjacentPositions.push(position + 1)
  }
  if (!edges.bottom) {
    if (!edges.left) {
      adjacentPositions.push(position + width - 1)
    }
    adjacentPositions.push(position + width)
    if (!edges.right) {
      adjacentPositions.push(position + width + 1)
    }
  }
  return adjacentPositions
}

export const generateMinePositions = ({ width, height }: BoardSize, numMines: number, firstClickPosition: Position): Set<number> => {
  const randomPositions = new Set<number>()
  const numCells = width * height
  let numPositionsToGenerate = numMines
  let numGenerated = 0

  // If mines fill more than half the spots, generate positions free of mines instead
  let shouldInvert = numMines > numCells / 2
  if (shouldInvert) {
    numPositionsToGenerate = numCells - numMines
    randomPositions.add(firstClickPosition)
    numGenerated = 1
  }
  
  while (numGenerated < numPositionsToGenerate) {
    const position = ~~(Math.random() * numCells)
    if (!randomPositions.has(position) && (shouldInvert || position !== firstClickPosition)) {
      randomPositions.add(position)
      numGenerated++
    }
  }

  if (!shouldInvert) return randomPositions

  const minePositions = new Set<number>()
  for (let i = 0; i < numCells; i++) {
    if (!randomPositions.has(i)) {
      minePositions.add(i)
    }
  }
  return minePositions
}

export const calculatePositionInfos = (boardSize: BoardSize, minePositions: Set<Position>): PositionInfo[] => {
  const positionInfos: PositionInfo[] = []
  const numCells = boardSize.width * boardSize.height
  for (let position = 0; position < numCells; position++) {
    const positionInfo: PositionInfo = { value: POSITION_VALUE.MINE }
    if (!minePositions.has(position)) {
      const adjacentPositions = getAdjacentPositions(position, boardSize)
      const numAdjacentMines = adjacentPositions.filter((position) => minePositions.has(position)).length
      positionInfo.value = NUM_ADJACENT_MINES_TO_POSITION_VALUE[numAdjacentMines]
      positionInfo.adjacentPositions = adjacentPositions
    }
    positionInfos.push(positionInfo)
  }
  return positionInfos
}