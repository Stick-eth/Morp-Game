import React from 'react';

function Menu({ startGame }) {
  return (
    <div className="launch-screen">
      <h1>Morp's</h1>
      <h2>made by stick</h2>
      <button className="start-button" onClick={() => startGame(false)}>Commencer (2 joueurs)</button>
      <button className="start-button" onClick={() => startGame(true)}>Commencer (Vs IA)</button>
    </div>
  );
}

export default Menu;
