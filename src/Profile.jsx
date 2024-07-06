import React, { useState } from 'react';

function Profile({ isAuthenticated, setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simuler la connexion
    if (email && password) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="profile">
      {isAuthenticated ? (
        <div>
          <h2>Bienvenue, utilisateur</h2>
          <p>Votre profil et vos informations apparaîtront ici.</p>
          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <h2>Connexion</h2>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Mot de passe:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Se connecter</button>
        </form>
      )}
    </div>
  );
}

export default Profile;
