import React, { useState } from 'react';
import Menu from './Menu';
import Game from './Game';
import './App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [isVsAI, setIsVsAI] = useState(false);
  const [helpMode, setHelpMode] = useState(false);

  const startGame = (vsAI) => {
    setIsVsAI(vsAI);
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
  };

  return (
    <div className="game">
      {gameStarted ? (
        <Game resetGame={resetGame} isVsAI={isVsAI} helpMode={helpMode} />
      ) : (
        <Menu startGame={startGame} setHelpMode={setHelpMode} helpMode={helpMode} />
      )}
    </div>
  );
}

export default App;
