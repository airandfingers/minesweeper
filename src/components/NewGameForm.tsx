import React, { FunctionComponent, SyntheticEvent, useState } from 'react';
import { createNewGameAction } from '../reducers';
import { BoardActionDispatch } from '../types'

type NumberInputWithLabelProps = {
  label: string,
  value: number,
  setValue: (value: number) => void
  min: number,
  max: number
}
const NumberInputwithLabel: FunctionComponent<NumberInputWithLabelProps> = ({ label, value, min, max, setValue }) =>  {
  const onChange = (e: SyntheticEvent) => setValue(parseInt((e.target as HTMLInputElement).value))
  return (
    <>
      <label htmlFor={label}>{label}</label>
      <input type="number" id={label} {...{ value, min, max, onChange }} />
    </>
  )
}

type NewGameFormProps = {
  dispatch: BoardActionDispatch
}
const NewGameForm: FunctionComponent<NewGameFormProps> = ({ dispatch }) => {
  const [width, setWidth] = useState(30)
  const [height, setHeight] = useState(16)
  const [numMines, setNumMines] = useState(99)
  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    dispatch(createNewGameAction(width, height, numMines))
  }
  return (
    <form onSubmit={onSubmit}>
      <NumberInputwithLabel label="Width" value={width} min={1} max={10000} setValue={setWidth} />
      <NumberInputwithLabel label="Height" value={height} min={1} max={10000} setValue={setHeight} />
      <NumberInputwithLabel label="# Mines" value={numMines} min={0} max={10000} setValue={setNumMines} />
      <input type="submit" value="Start New Game" />
    </form>
  )
}

export default NewGameForm