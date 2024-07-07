import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  autoConnect: false, // Prevent automatic connection
}); // Your server address

function Multiplayer() {
  const [matchFound, setMatchFound] = useState(false);
  const [opponent, setOpponent] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [searching, setSearching] = useState(false);
  const [user, setUser] = useState(null);
  const [matchId, setMatchId] = useState(null);

  // Setup user from token once on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUser(decodedToken.user);
    }
  }, []);

  // Setup socket listeners once user is set
  useEffect(() => {
    if (user) {
      socket.on('matchFound', ({ matchId, players }) => {
        const opponent = players.find(player => player.id !== user._id);
        setOpponent(opponent);
        setMatchFound(true);
        setMatchId(matchId);
        setSearching(false);
      });

      socket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off('matchFound');
        socket.off('receiveMessage');
      };
    }
  }, [user]);

  // Connect and disconnect socket based on `searching` state
  useEffect(() => {
    if (searching && user) {
      socket.connect();
      console.log(`Joining queue: ${user.pseudo} (Elo: ${user.elo})`);
      socket.emit('joinQueue', user);
    }

    return () => {
      if (searching && user) {
        console.log(`Leaving queue: ${user.pseudo} (Elo: ${user.elo})`);
        socket.emit('leaveQueue', user);
        socket.disconnect();
      }
    };
  }, [searching, user]);

  const startMatchmaking = () => {
    setSearching(true);
  };

  const leaveMatchmaking = () => {
    setSearching(false);
  };

  const sendMessage = () => {
    if (message.trim() && matchId) {
      socket.emit('sendMessage', { matchId, message });
      setMessages((prevMessages) => [...prevMessages, { user: user.pseudo, text: message }]);
      setMessage('');
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
          <h3>Joueur trouvé: {opponent?.pseudo}</h3>
          <div className="chat">
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index}>
                  <strong>{msg.user}</strong>: {msg.text}
                </div>
              ))}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Envoyer</button>
          </div>
          <button onClick={leaveMatchmaking}>Quitter</button>
        </div>
      )}
    </div>
  );
}

export default Multiplayer;
