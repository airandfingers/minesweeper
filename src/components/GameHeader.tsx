import React, { FunctionComponent } from 'react';
import { createNewGameAction } from '../reducers';
import { BoardActionDispatch } from '../types'

type GameHeaderProps = {
  numMines: number,
  numFlags: number,
  dispatch: BoardActionDispatch,
}
const GameHeader: FunctionComponent<GameHeaderProps> = ({ numMines, numFlags, dispatch }) => {
  const onClick = () =>
    dispatch(createNewGameAction())
  return (
    <div>
      <span>{numMines - numFlags }</span>
      <button onClick={onClick}>🐱</button>
    </div>
  )
}

export default GameHeader