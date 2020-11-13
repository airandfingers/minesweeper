import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Minesweeper header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Minesweeper/i);
  expect(headerElement).toBeInTheDocument();
});
