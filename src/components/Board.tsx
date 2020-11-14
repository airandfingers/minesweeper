import React, { FunctionComponent, SyntheticEvent } from 'react';
import { createOpenCellAction, createToggleFlagAction } from '../actions';
import { GameState, CellState, BoardActionDispatch, CELL_DISPLAY } from '../types'

type CellProps = {
  cellState: CellState,
  rowNum: number,
  colNum: number,
  dispatch: BoardActionDispatch,
}
let Cell: FunctionComponent<CellProps> = ({ cellState, rowNum, colNum, dispatch }) => {
  const { contents } = cellState
  let stateClass
  let onClick
  let onContextMenu
  let textContent: String | null = cellState.contents // CELL_CONTENTS values match what we want to display except for NEW
  if (contents === CELL_DISPLAY.NEW || contents === CELL_DISPLAY.FLAG) {
    stateClass = 'closed'
    onContextMenu = (e: SyntheticEvent) => {
      e.preventDefault()
      dispatch(createToggleFlagAction(rowNum, colNum))
    }
    if (contents === CELL_DISPLAY.NEW) {
      onClick = () => dispatch(createOpenCellAction(rowNum, colNum))
      textContent = null
    }
  } else {
    stateClass = 'open'
  }
  return <td className={`cell noselect ${stateClass}`} {...{ onClick, onContextMenu }}>{textContent}</td>
}
Cell = React.memo(Cell)

type RowProps = {
  cellStates: CellState[],
  rowNum: number,
  dispatch: BoardActionDispatch,
}
let Row: FunctionComponent<RowProps> = ({ cellStates, rowNum, dispatch }) => (
  <tr className="row" key={`row-${rowNum}`}>
    {cellStates.map((cellState, colNum) => (
      <Cell key={`cell-${rowNum}.${colNum}`} {...{ cellState, rowNum, colNum, dispatch }} />
    ))}
  </tr>
)
Row = React.memo(Row, (prevProps, nextProps) =>
  prevProps.cellStates.length === nextProps.cellStates.length &&
  prevProps.cellStates.every((cellState, i) => cellState.contents === nextProps.cellStates[i].contents)
)

type BoardProps = GameState & {
  dispatch: BoardActionDispatch,
}
const Board: FunctionComponent<BoardProps> = ({ boardState, boardSize: { width, height }, dispatch }) => {
  const cellStatesByRowNum = []
  const numCells = width * height
  for (let i = 0; i < numCells; i += width) {
    cellStatesByRowNum.push(boardState.slice(i, i + width))
  }

  return (
    <table onContextMenu={(e) => e.preventDefault()}>
      <tbody>
        {cellStatesByRowNum.map((cellStates, rowNum) => (
          <Row key={`row-${rowNum}`} {...{ cellStates, rowNum, dispatch }} />
        ))}
      </tbody>
    </table>
  )
}

export default Board