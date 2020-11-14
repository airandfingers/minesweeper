import { BoardAction, BOARD_ACTION } from './types'

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