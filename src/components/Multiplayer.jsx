import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Board from './Board';

const socket = io('http://localhost:5000', {
  autoConnect: false,
});

function Multiplayer() {
  const [matchFound, setMatchFound] = useState(false);
  const [opponent, setOpponent] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [searching, setSearching] = useState(false);
  const [myTurn, setMyTurn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUser(decodedToken.user);
    }
  }, []);

  useEffect(() => {
    if (user) {
      socket.on('matchFound', ({ roomId, players, currentPlayer, opponent }) => {
        setOpponent(opponent);
        setMatchFound(true);
        setRoomId(roomId);
        setSearching(false);
        setCurrentPlayer(currentPlayer);
        setMyTurn(currentPlayer === user.pseudo);
      });

      socket.on('moveMade', ({ board, currentPlayer }) => {
        setBoard(board);
        setCurrentPlayer(currentPlayer);
        setMyTurn(currentPlayer === user.pseudo);
      });

      socket.on('invalidMove', ({ message }) => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(''), 2000);
      });

      socket.on('gameOver', ({ winner }) => {
        setWinner(winner);
      });

      return () => {
        socket.off('matchFound');
        socket.off('moveMade');
        socket.off('invalidMove');
        socket.off('gameOver');
      };
    }
  }, [user]);

  useEffect(() => {
    if (searching && user) {
      socket.connect();
      console.log(`Joining queue: ${user.pseudo}`);
      socket.emit('joinQueue', user);
    }

    return () => {
      if (searching && user) {
        console.log(`Leaving queue: ${user.pseudo}`);
        socket.emit('leaveQueue', user);
      }
    };
  }, [searching, user]);

  const startMatchmaking = () => {
    setSearching(true);
  };

  const leaveMatchmaking = () => {
    setSearching(false);
    setMatchFound(false);
    setBoard(Array(9).fill(null));
    setOpponent(null);
    setCurrentPlayer(null);
    setRoomId(null);
    setMyTurn(false);
    setErrorMessage('');
    setWinner(null);
    socket.disconnect(); // Disconnect when leaving matchmaking or game
  };

  const handleClick = (index) => {
    if (!board[index] && myTurn && !winner) {
      socket.emit('makeMove', { roomId, index });
    }
  };

  return (
    <div className="multiplayer">
      <h2>Mode Multijoueur</h2>
      {!matchFound ? (
        <>
          {!searching ? (
            <button onClick={startMatchmaking}>Lancer le matchmaking</button>
          ) : (
            <div>
              <p>Recherche de joueur en cours...</p>
              <button onClick={leaveMatchmaking}>Annuler le matchmaking</button>
            </div>
          )}
        </>
      ) : (
        <div>
          <h3>Joueur trouvé: {opponent}</h3>
          <p>{myTurn ? "C'est votre tour" : `Tour de ${opponent}`}</p>
          {errorMessage && <p className="error">{errorMessage}</p>}
          {winner && <p className="winner">Le gagnant est: {winner}</p>}
          <Board board={board} onClick={handleClick} />
          <button onClick={leaveMatchmaking}>Quitter</button>
        </div>
      )}
    </div>
  );
}

export default Multiplayer;
