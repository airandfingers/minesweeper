import React, { FunctionComponent } from 'react';
import { createNewGameAction } from '../actions';
import { BoardActionDispatch, GAME_STATUS } from '../types'

const STATUS_TO_BUTTON_TEXT = {
  [GAME_STATUS.UNINITIALIZED]: '🐱',
  [GAME_STATUS.NEW]: '😺',
  [GAME_STATUS.IN_PROGRESS]: '😺',
  [GAME_STATUS.LOST]: '😿',
  [GAME_STATUS.WON]: '😻'
}

type GameHeaderProps = {
  status: GAME_STATUS,
  numMines: number,
  numFlags: number,
  dispatch: BoardActionDispatch,
}
const GameHeader: FunctionComponent<GameHeaderProps> = ({ status, numMines, numFlags, dispatch }) => {
  const numMinesRemaining = numMines - numFlags
  let statusText = `${numMinesRemaining} mines remaining`
  if (numMinesRemaining === 1) statusText = `1 mine remaining`
  if (status === GAME_STATUS.WON) statusText = 'You win!'
  if (status === GAME_STATUS.LOST) statusText = 'You lose!'
  
  const onClick = () => dispatch(createNewGameAction())

  return (
    <div>
      <span>{statusText}</span>
      &nbsp;
      <button onClick={onClick}>{STATUS_TO_BUTTON_TEXT[status]}</button>
    </div>
  )
}

export default GameHeader