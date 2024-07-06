import React, { useState, useEffect } from 'react';
import './App.css';

const initialBoard = Array(9).fill(null);

function Game({ resetGame, isVsAI }) {
  const [board, setBoard] = useState(initialBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [xPositions, setXPositions] = useState([]);
  const [oPositions, setOPositions] = useState([]);
  const winner = calculateWinner(board);

  useEffect(() => {
    if (isVsAI && !isXNext && !winner) {
      handleAIMove();
    }
  }, [isXNext, isVsAI, winner]);

  const handleClick = (index) => {
    if (winner || board[index]) {
      return;
    }

    const currentPlayer = isXNext ? 'X' : 'O';
    const newBoard = [...board];
    const newPositions = isXNext ? [...xPositions] : [...oPositions];

    if (newPositions.length < 3) {
      newBoard[index] = currentPlayer;
      newPositions.push(index);
    } else {
      const oldIndex = newPositions.shift();
      newBoard[oldIndex] = null;
      newBoard[index] = currentPlayer;
      newPositions.push(index);
    }

    setBoard(newBoard);
    isXNext ? setXPositions(newPositions) : setOPositions(newPositions);
    setIsXNext(!isXNext);
  };

  const handleAIMove = () => {
    const emptySquares = board.map((value, index) => (value === null ? index : null)).filter(val => val !== null);
    const randomMove = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    handleClick(randomMove);
  };

  const renderSquare = (index) => {
    const currentPlayerPositions = isXNext ? xPositions : oPositions;
    const nextMovePosition = currentPlayerPositions[0];
    const showIndicator = currentPlayerPositions.length === 3 && nextMovePosition === index;

    return (
      <button className="square" onClick={() => handleClick(index)}>
        {board[index]}
        {showIndicator && (
          <span className="indicator">!</span>
        )}
      </button>
    );
  };

  return (
    <>
      <div className="board">
        {board.map((_, index) => renderSquare(index))}
      </div>
      <div className="info">
        {winner ? `Gagnant: ${winner}` : `Prochain joueur: ${isXNext ? 'X' : 'O'}`}
      </div>
      <button className="reset-button" onClick={resetGame}>Réinitialiser</button>
    </>
  );
}

function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

export default Game;
