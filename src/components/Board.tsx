import React, { FunctionComponent, SyntheticEvent } from 'react';
import { createOpenCellAction, createToggleFlagAction } from '../reducers';
import { GameState, RowState, CellState, BoardActionDispatch, CELL_CONTENTS } from '../types'

type CellProps = {
  cellState: CellState,
  rowNum: number,
  colNum: number,
  dispatch: BoardActionDispatch,
}
let Cell: FunctionComponent<CellProps> = ({ cellState, rowNum, colNum, dispatch }) => {
  let stateClass
  let onClick
  let onContextMenu
  let contents = null
  switch (cellState.contents) {
    // Possible states for unopened cells
    case CELL_CONTENTS.NEW:
      stateClass = 'closed'
      onClick = () => dispatch(createOpenCellAction(rowNum, colNum))
      onContextMenu = (e: SyntheticEvent) => {
        e.preventDefault()
        dispatch(createToggleFlagAction(rowNum, colNum))
      }
      break
    case CELL_CONTENTS.FLAG:
      stateClass = 'flagged'
      onContextMenu = (e: SyntheticEvent) => {
        e.preventDefault()
        dispatch(createToggleFlagAction(rowNum, colNum))
      }
      contents = '🚩'
      break
    // Possible states for unopened cells after game is over
    case CELL_CONTENTS.DORMANT_MINE:
    case CELL_CONTENTS.FALSE_FLAG:
    // Possible states for open cells
    case CELL_CONTENTS.EXPLODED_MINE:
    case CELL_CONTENTS.EMPTY:
    case CELL_CONTENTS.ONE:
    case CELL_CONTENTS.TWO:
    case CELL_CONTENTS.THREE:
    case CELL_CONTENTS.FOUR:
    case CELL_CONTENTS.FIVE:
    case CELL_CONTENTS.SIX:
    case CELL_CONTENTS.SEVEN:
    case CELL_CONTENTS.EIGHT:
      stateClass = 'open'
      contents = cellState.contents
  }
  return <td className={`cell ${stateClass}`} {...{ onClick, onContextMenu }}>{contents}</td>
}
Cell = React.memo(Cell)

type RowProps = {
  rowState: RowState,
  rowNum: number,
  dispatch: BoardActionDispatch,
}
const Row: FunctionComponent<RowProps> = ({ rowState, rowNum, dispatch }) => (
  <tr className="row" key={`row-${rowNum}`}>
    {rowState.map((cellState, colNum) => (
      <Cell key={`cell-${rowNum}.${colNum}`} {...{ cellState, rowNum, colNum, dispatch }} />
    ))}
  </tr>
)

type BoardProps = GameState & {
  dispatch: BoardActionDispatch,
}
const Board: FunctionComponent<BoardProps> = ({ boardState, dispatch }) => {
  return (
    <table>
      <tbody>
        {boardState.map((rowState, rowNum) => (
          <Row key={`row-${rowNum}`} {...{ rowState, rowNum, dispatch }} />
        ))}
      </tbody>
    </table>
  )
}

export default Board