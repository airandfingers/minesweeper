import { BoardAction, BOARD_ACTION, GameState, BoardState, GAME_STATUS, POSITION_VALUE, CELL_DISPLAY, CellActionPayload, NewGamePayload, BoardSize, Position, PositionInfo, CELL_CONTENTS } from './types'
import { copyBoardState, NUM_ADJACENT_MINES_TO_POSITION_VALUE, calculatePositionFromRowCol, generateMinePositions, calculatePositionInfos } from './utils'

const setCellContents = (position: Position, newContents: CELL_CONTENTS, boardState: BoardState,): void => {
  boardState[position].contents = newContents
}

const revealMines = (positionInfos: PositionInfo[], mineReplacement: CELL_CONTENTS, boardState: BoardState) => {
  positionInfos.forEach(({ value }: PositionInfo, position: Position) => {
    const contents = boardState[position].contents
    if (contents === CELL_DISPLAY.NEW && value === POSITION_VALUE.MINE) {
      setCellContents(position, mineReplacement, boardState)
    }
    else if (contents === CELL_DISPLAY.FLAG && value !== POSITION_VALUE.MINE) {
      setCellContents(position, CELL_DISPLAY.FALSE_FLAG, boardState)
    }
  })
}

const openCell = (initialPosition: Position, boardSize: BoardSize, positionInfos: PositionInfo[], boardState: BoardState): number => {
  const cellsToOpen: Set<Position> = new Set([initialPosition])
  let numOpened = 0
  cellsToOpen.forEach((position) => {
    if (boardState[position].contents !== CELL_DISPLAY.NEW) {
      // ignore open cells
      return
    }
    const { value, adjacentPositions } = positionInfos[position]
    setCellContents(position, NUM_ADJACENT_MINES_TO_POSITION_VALUE[parseInt(value, 10)], boardState)
    numOpened++
    if (value === POSITION_VALUE.EMPTY && adjacentPositions) {
      // no mines here, so repeat for any adjacent cells
      adjacentPositions.forEach((adjacentIndex) => cellsToOpen.add(adjacentIndex))
    }
  })
  return numOpened
}

export const gameReducer = (gameState: GameState, { type, payload }: BoardAction): GameState => {
  const { boardState, numFlags, status, boardSize, numMines } = gameState
  // console.log('in gameReducer, gameState is', gameState, ', action is', { type, payload })
  if (type === BOARD_ACTION.NEW_GAME) {
    let { boardSize: newBoardSize, numMines: newNumMines } = payload as NewGamePayload
    newBoardSize = newBoardSize ?? boardSize
    newNumMines = newNumMines ?? numMines
    const numCells = newBoardSize.width * newBoardSize.height
    const newBoardState: BoardState = []
    for (let i = 0; i < numCells; i++) {
      newBoardState.push({ contents: CELL_DISPLAY.NEW })
    }
    return {
      status: GAME_STATUS.NEW,
      boardState: newBoardState,
      numFlags: 0,
      boardSize: newBoardSize,
      numMines: newNumMines,
      positionInfos: [],
      numOpened: 0,
    }
  }

  // action is a CellAction
  const { rowNum, colNum } = payload as CellActionPayload
  const position = calculatePositionFromRowCol(rowNum, colNum, boardSize)

  if (type === BOARD_ACTION.OPEN_CELL) {
    let { status, positionInfos, numOpened } = gameState
    if (status === GAME_STATUS.NEW) {
      // first click; populate mines
      const minePositions = generateMinePositions(boardSize, numMines, position)
      positionInfos = calculatePositionInfos(boardSize, minePositions)
      status = GAME_STATUS.IN_PROGRESS
    }
    else if (status !== GAME_STATUS.IN_PROGRESS) {
      console.log('Ignoring OPEN_CELL action dispatched when status is', status)
      return gameState
    }
    const newBoardState = copyBoardState(boardState)
    if (positionInfos[position].value === POSITION_VALUE.MINE) {
      setCellContents(position, CELL_DISPLAY.EXPLODED_MINE, newBoardState)
      status = GAME_STATUS.LOST
      revealMines(positionInfos, POSITION_VALUE.MINE, newBoardState)
    }
    else {
      numOpened += openCell(position, boardSize, positionInfos, newBoardState)
      if (numOpened >= boardSize.width * boardSize.height - numMines) {
        status = GAME_STATUS.WON
        revealMines(positionInfos, CELL_DISPLAY.FLAG, newBoardState)
      }
    }
    return {
      ...gameState,
      status,
      boardState: newBoardState,
      positionInfos,
      numOpened
    }
  }

  if (type === BOARD_ACTION.TOGGLE_FLAG) {
    if (status !== GAME_STATUS.NEW && status !== GAME_STATUS.IN_PROGRESS) {
      console.log('Ignoring TOGGLE_FLAG action dispatched when status is', status)
      return gameState
    }
    const contents = boardState[position].contents
    let newContents
    let newNumFlags
    if (contents === CELL_DISPLAY.FLAG) {
      newContents = CELL_DISPLAY.NEW
      newNumFlags = numFlags - 1
    }
    else if (contents === CELL_DISPLAY.NEW) {
      if (numFlags === gameState.numMines) {
        console.log('Ignoring TOGGLE_FLAG action', { numFlags, numMines: gameState.numMines })
        return gameState
      }
      newContents = CELL_DISPLAY.FLAG
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