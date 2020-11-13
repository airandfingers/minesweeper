import { Dispatch } from 'react'

export enum CELL_CONTENTS {
  // Possible states for closed cells
  NEW = 'NEW',
  FLAG = 'FLAG',
  DORMANT_MINE = '💣',
  FALSE_FLAG = '🎌',
  // Possible states for open cells
  EXPLODED_MINE = '💥',
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
export type CellState = {
  contents: CELL_CONTENTS
}
export type RowState = Array<CellState>
export type BoardState = Array<RowState>

export type Position = {
  rowNum: number,
  colNum: number
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
  mineIndexes: Set<number>
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
export type CellActionPayload = Position
export type BoardAction =
  | { type: BOARD_ACTION.NEW_GAME, payload: NewGamePayload }
  | { type: BOARD_ACTION.OPEN_CELL, payload: CellActionPayload }
  | { type: BOARD_ACTION.TOGGLE_FLAG, payload: CellActionPayload }

export type BoardActionDispatch = Dispatch<BoardAction>