import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Menu from './Menu';
import Game from './Game';
import Profile from './Profile';
import Multiplayer from './Multiplayer';
import './App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [isVsAI, setIsVsAI] = useState(false);
  const [helpMode, setHelpMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const startGame = (vsAI) => {
    setIsVsAI(vsAI);
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
  };

  return (
    <Router>
      <div className="game">
        <nav>
          <Link to="/">Menu</Link>
          <Link to="/profile">Profile</Link>
        </nav>
        <Routes>
          <Route path="/" element={
            gameStarted ? (
              <Game resetGame={resetGame} isVsAI={isVsAI} helpMode={helpMode} />
            ) : (
              <Menu startGame={startGame} setHelpMode={setHelpMode} helpMode={helpMode} />
            )
          } />
          <Route path="/profile" element={<Profile isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/multiplayer" element={<Multiplayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
