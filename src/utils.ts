import { BoardState, CELL_CONTENTS, Position } from './types'

export const copyBoardState = (boardState: BoardState) =>
  boardState.map((row) => 
    row.map((cell) =>
      ({ contents: cell.contents })
    )
  )
export const getCellContents = ({ rowNum, colNum }: Position, boardState: BoardState,): CELL_CONTENTS =>
  boardState[rowNum][colNum].contents
export const setCellContents = ({ rowNum, colNum }: Position, newContents: CELL_CONTENTS, boardState: BoardState,): void => {
  boardState[rowNum][colNum].contents = newContents
}

export const NUM_ADJACENT_MINES_TO_CELL_CONTENTS = [
  CELL_CONTENTS.EMPTY,
  CELL_CONTENTS.ONE,
  CELL_CONTENTS.TWO,
  CELL_CONTENTS.THREE,
  CELL_CONTENTS.FOUR,
  CELL_CONTENTS.FIVE,
  CELL_CONTENTS.SIX,
  CELL_CONTENTS.SEVEN,
  CELL_CONTENTS.EIGHT,
]