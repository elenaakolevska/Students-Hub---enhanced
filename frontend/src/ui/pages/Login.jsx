import React, { useState } from 'react';
import Navigation from '../Navigation';
import Footer from '../Footer';
import { login as loginApi } from '../../repository/userRepository';
import { useContext } from 'react';
import authContext from '../../contexts/authContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(authContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Login attempt:', { username, password });
    try {
      const user = await loginApi(username, password);
      setUser(user); // Save user in context
      // Optionally redirect, e.g. window.location = '/';
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation />
      <main className="container flex-grow-1 py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow p-4">
              <h3 className="mb-4 text-center">Login</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username or Email</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
              <div className="mt-3 text-center">
                <a href="/register">Don't have an account? Register</a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
