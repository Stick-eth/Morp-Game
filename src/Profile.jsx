import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile({ isAuthenticated, setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setPseudo(decodedToken.user.pseudo);
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setPseudo(response.data.pseudo);
      setIsAuthenticated(true);
      setError('');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { email, password, pseudo });
      localStorage.setItem('token', response.data.token);
      setPseudo(response.data.pseudo);
      setIsAuthenticated(true);
      setError('');
    } catch (error) {
      console.error('Register error:', error);
      setError('User already exists. Please try logging in.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setPseudo('');
  };

  return (
    <div className="profile">
      {isAuthenticated ? (
        <div>
          <h2>Welcome, {pseudo}</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          {isLogin ? (
            <form onSubmit={handleLogin}>
              <h2>Login</h2>
              {error && <p className="error">{error}</p>}
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
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <br />
              <button type="submit">Login</button>
              <p>
                Don't have an account?{' '}
                <span onClick={() => { setIsLogin(false); setError(''); }} className="switch">
                  Register
                </span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <h2>Register</h2>
              {error && <p className="error">{error}</p>}
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
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <br />
              <label>
                Pseudo:
                <input
                  type="text"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  required
                />
              </label>
              <br />
              <button type="submit">Register</button>
              <p>
                Already have an account?{' '}
                <span onClick={() => { setIsLogin(true); setError(''); }} className="switch">
                  Login
                </span>
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
