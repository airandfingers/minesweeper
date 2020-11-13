import { BoardAction, BOARD_ACTION, GameState, BoardState, RowState, GAME_STATUS, CELL_CONTENTS, CellActionPayload, NewGamePayload, Position, BoardSize } from './types'
import { copyBoardState, getCellContents, setCellContents, NUM_ADJACENT_MINES_TO_CELL_CONTENTS } from './utils'

export const createNewGameAction = (width?: number, height?: number, numMines?: number): BoardAction => {
  const newGameAction: BoardAction = {
    type: BOARD_ACTION.NEW_GAME,
    payload: {}
  }
  if (width !== undefined && height !== undefined && numMines !== undefined) {
    newGameAction.payload = {
      boardSize: {
        width,
        height
      },
      numMines
    }
  }
  return newGameAction
}

export const createOpenCellAction = (rowNum: number, colNum: number,): BoardAction => {
  return {
    type: BOARD_ACTION.OPEN_CELL,
    payload: {
      rowNum,
      colNum
    }
  }
}

export const createToggleFlagAction = (rowNum: number, colNum: number,): BoardAction => {
  return {
    type: BOARD_ACTION.TOGGLE_FLAG,
    payload: {
      rowNum,
      colNum
    }
  }
}

const calculateIndex = ({ rowNum, colNum }: Position, { width }: BoardSize): number => rowNum * width + colNum

const calculatePosition = (index: number, { width }: BoardSize): Position => ({ rowNum: ~~(index / width), colNum: index % width })

const isMineAtPosition = (position: Position, boardSize: BoardSize, mineIndexes: Set<number>) => mineIndexes.has(calculateIndex(position, boardSize))

const generateMineIndexes = ({ width, height }: BoardSize, numMines: number, firstClickPosition: Position): Set<number> => {
  const randomIndexes = new Set<number>()
  const numCells = width * height
  const maxIndex = numCells - 1
  const mineFreeIndex = calculateIndex(firstClickPosition, { width, height })
  let numIndexesToGenerate = numMines
  let numGenerated = 0

  // If mines fill more than half the spots, generate indexes free of mines instead
  let shouldInvert = numMines > numCells / 2
  if (shouldInvert) {
    numIndexesToGenerate = numCells - numMines
    randomIndexes.add(mineFreeIndex)
    numGenerated = 1
  }
  
  while (numGenerated < numIndexesToGenerate) {
    const index = ~~(Math.random() * maxIndex)
    if (!randomIndexes.has(index) && (shouldInvert || index !== mineFreeIndex)) {
      randomIndexes.add(index)
      numGenerated++
    }
  }

  if (!shouldInvert) return randomIndexes

  const mineIndexes = new Set<number>()
  for (let i = 0; i < numCells; i++) {
    if (!randomIndexes.has(i)) {
      mineIndexes.add(i)
    }
  }
  return mineIndexes
}

export const getAdjacentIndexes = ({ rowNum, colNum }: Position, { width, height }: BoardSize): number[] => {
  const index = calculateIndex({ rowNum, colNum }, { width, height })
  const edges = {
    left: colNum === 0,
    top: rowNum === 0,
    right: colNum === width - 1,
    bottom: rowNum === height - 1
  }
  const adjacentIndexes: number[] = []
  if (!edges.top) {
    adjacentIndexes.push(index - width)
    if (!edges.left) {
      adjacentIndexes.push(index - width - 1)
    }
    if (!edges.right) {
      adjacentIndexes.push(index - width + 1)
    }
  }
  if (!edges.left) {
    adjacentIndexes.push(index - 1)
  }
  if (!edges.right) {
    adjacentIndexes.push(index + 1)
  }
  if (!edges.bottom) {
    adjacentIndexes.push(index + width)
    if (!edges.left) {
      adjacentIndexes.push(index + width - 1)
    }
    if (!edges.right) {
      adjacentIndexes.push(index + width + 1)
    }
  }
  return adjacentIndexes
}

const openCell = (initialPosition: Position, boardSize: BoardSize, mineIndexes: Set<number>, boardState: BoardState) => {
  performance.mark('open cell')
  const initialIndex = calculateIndex(initialPosition, boardSize)
  const cellsToOpen: Set<number> = new Set([initialIndex])
  cellsToOpen.forEach((index) => {
    performance.mark('open cell loop iteration')
    performance.mark('open cell loop iteration position')
    console.log('index is', index)
    const position = calculatePosition(index, boardSize)
    const contents = getCellContents(position, boardState)
    if (contents !== CELL_CONTENTS.NEW) {
      // cell was already opened
      return
    }
    performance.mark('open cell loop iteration position complete')
    performance.measure('open cell loop iteration position', 'open cell loop iteration position', 'open cell loop iteration position complete')
    performance.mark('open cell loop iteration adjacent check')
    const adjacentIndexes = getAdjacentIndexes(position, boardSize)
    const numAdjacentMines = adjacentIndexes.filter((index) => mineIndexes.has(index)).length
    performance.mark('open cell loop iteration adjacent check complete')
    performance.measure('open cell loop iteration adjacent check', 'open cell loop iteration adjacent check', 'open cell loop iteration adjacent check complete')
    performance.mark('open cell loop set cell contents')
    setCellContents(position, NUM_ADJACENT_MINES_TO_CELL_CONTENTS[numAdjacentMines], boardState)
    console.log('numAdjacentMines is', numAdjacentMines)
    performance.mark('open cell loop set cell contents complete')
    performance.measure('open cell loop set cell contents', 'open cell loop set cell contents', 'open cell loop set cell contents complete')
    performance.mark('open cell loop add adjacents')
    if (numAdjacentMines === 0) {
      // no mines here, so repeat for any adjacent cells
      adjacentIndexes.forEach((adjacentIndex) => cellsToOpen.add(adjacentIndex))
    }
    performance.mark('open cell loop add adjacents complete')
    performance.measure('open cell loop add adjacents', 'open cell loop add adjacents', 'open cell loop add adjacents complete')
    console.log(cellsToOpen.size)
    performance.mark('open cell loop iteration complete')
    performance.measure('open cell loop iteration', 'open cell loop iteration', 'open cell loop iteration complete')
  })
  performance.mark('open cell complete')
  performance.measure('open cell', 'open cell', 'open cell complete')
}

export const gameReducer = (gameState: GameState, { type, payload }: BoardAction): GameState => {
  const { boardState, numFlags, status, boardSize, numMines } = gameState
  console.log('in gameReducer, gameState is', gameState, ', action is', { type, payload })
  if (type === BOARD_ACTION.NEW_GAME) {
    let { boardSize: newBoardSize, numMines: newNumMines } = payload as NewGamePayload
    newBoardSize = newBoardSize ?? boardSize
    newNumMines = newNumMines ?? numMines
    const newBoardState: BoardState = []
    performance.mark('create')
    for (let i = 0; i < newBoardSize.height; i++) {
      const row: RowState = []
      newBoardState.push(row)
      for (let j = 0; j < newBoardSize.width; j++) {
        row.push({ contents: CELL_CONTENTS.NEW })
      }
    }
    performance.mark('create board complete')
    performance.measure('Create Board', 'create', 'create board complete')
    return {
      status: GAME_STATUS.NEW,
      boardState: newBoardState,
      numFlags: 0,
      boardSize: newBoardSize,
      numMines: newNumMines,
      mineIndexes: new Set<number>()
    }
  }
  // action is a CellAction
  const position = payload as CellActionPayload
  if (type === BOARD_ACTION.OPEN_CELL) {
    let { status, mineIndexes } = gameState
    if (status === GAME_STATUS.NEW) {
      // first click; populate mines
      mineIndexes = generateMineIndexes(boardSize, numMines, position)
      status = GAME_STATUS.IN_PROGRESS
    }
    else if (status !== GAME_STATUS.IN_PROGRESS) {
      console.log('Ignoring OPEN_CELL action dispatched when status is', status)
      return gameState
    }
    performance.mark('copy board')
    const newBoardState = copyBoardState(boardState)
    performance.mark('copy board complete')
    performance.measure('Copy Board', 'copy board', 'copy board complete')
    if (isMineAtPosition(position, boardSize, mineIndexes)) {
      status = GAME_STATUS.LOST
      setCellContents(position, CELL_CONTENTS.EXPLODED_MINE, newBoardState)
      mineIndexes.forEach((index) => {
        const minePosition = calculatePosition(index, boardSize)
        const mineCellContents = getCellContents(minePosition, newBoardState)
        if (mineCellContents === CELL_CONTENTS.NEW) {
          setCellContents(minePosition, CELL_CONTENTS.DORMANT_MINE, newBoardState)
        }
      })
    }
    else {
      openCell(position, boardSize, mineIndexes, boardState)
    }
    return {
      ...gameState,
      status,
      boardState: newBoardState,
      mineIndexes
    }
  }
  if (type === BOARD_ACTION.TOGGLE_FLAG) {
    if (status !== GAME_STATUS.NEW && status !== GAME_STATUS.IN_PROGRESS) {
      console.log('Ignoring TOGGLE_FLAG action dispatched when status is', status)
      return gameState
    }
    const contents = getCellContents(position, boardState)
    let newContents
    let newNumFlags
    if (contents === CELL_CONTENTS.FLAG) {
      newContents = CELL_CONTENTS.NEW
      newNumFlags = numFlags - 1
    }
    else if (contents === CELL_CONTENTS.NEW) {
      if (numFlags === gameState.numMines) {
        console.log('Ignoring TOGGLE_FLAG action', { numFlags, numMines: gameState.numMines })
        return gameState
      }
      newContents = CELL_CONTENTS.FLAG
      newNumFlags = numFlags + 1
    }
    else {
      console.log('Ignoring TOGGLE_FLAG action dispatched for cell with contents', contents)
      return gameState
    }
    const newBoardState = copyBoardState(boardState)
    setCellContents(position, newContents, newBoardState)
    return {
      ...gameState,
      boardState: newBoardState,
      numFlags: newNumFlags
    }
  }
  else {
    // Should never happen
    console.error('gameReducer called with unknown action:', { type, payload })
    return gameState
  }
}