import { Dispatch } from 'react'

export enum POSITION_VALUE {
  // Mine or number a cell will reveal when clicked
  MINE = '💣',
  EMPTY = '',
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
}
export enum CELL_DISPLAY {
  // States a cell can take, depending on user interaction
  NEW = '',
  FLAG = '🚩',
  FALSE_FLAG = '🎌',
  EXPLODED_MINE = '💥',
}
export type CELL_CONTENTS = POSITION_VALUE | CELL_DISPLAY
export type CellState = {
  contents: CELL_CONTENTS
}
export type BoardState = Array<CellState>

export type Position = number

export type PositionInfo = {
  value: POSITION_VALUE,
  adjacentPositions?: Position[]
}

export type BoardSize = {
  width: number,
  height: number
}

export enum GAME_STATUS {
  UNINITIALIZED = 'UNINITIALIZED',
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  WON = 'WON',
  LOST = 'LOST'
}
export type GameState = {
  status: GAME_STATUS,
  boardState: BoardState,
  numFlags: number,
  boardSize: BoardSize
  numMines: number,
  positionInfos: PositionInfo[],
  numOpened: number
}

export enum BOARD_ACTION {
  NEW_GAME = 'NEW_GAME',
  OPEN_CELL = 'OPEN_CELL',
  TOGGLE_FLAG = 'TOGGLE_FLAG',
}
export type NewGamePayload = {
  boardSize?: BoardSize,
  numMines?: number
}
export type CellActionPayload = {
  rowNum: number,
  colNum: number
}
export type BoardAction =
  | { type: BOARD_ACTION.NEW_GAME, payload: NewGamePayload }
  | { type: BOARD_ACTION.OPEN_CELL, payload: CellActionPayload }
  | { type: BOARD_ACTION.TOGGLE_FLAG, payload: CellActionPayload }

export type BoardActionDispatch = Dispatch<BoardAction>