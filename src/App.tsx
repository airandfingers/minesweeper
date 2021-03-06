import React, { useReducer } from 'react';
import './App.css';
import { GAME_STATUS } from './types'
import NewGameForm from './components/NewGameForm'
import GameHeader from './components/GameHeader'
import Board from './components/Board'
import { gameReducer } from './reducers'

const App = () => {
  const [gameState, dispatch] = useReducer(gameReducer, {
    status: GAME_STATUS.UNINITIALIZED,
    boardState: [],
    numFlags: 0,
    boardSize: {
      width: 0,
      height: 0,
    },
    numMines: 0,
    positionInfos: [],
    numOpened: 0
  })
  const { status, numMines, numFlags} = gameState
  return (
    <div className="App">
      <header className="App-header">
        <h1>Minesweeper!</h1>
      </header>
      <main>
        <NewGameForm dispatch={dispatch} />
        {gameState.status !== GAME_STATUS.UNINITIALIZED && (
          <div className="game">
            <GameHeader {...{ status, numMines, numFlags, dispatch }} />
            <Board {...{ ...gameState, dispatch }} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
