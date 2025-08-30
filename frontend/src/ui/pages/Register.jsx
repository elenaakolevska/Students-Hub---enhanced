import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';
import Footer from '../Footer';
import { register as registerApi } from '../../repository/userRepository';
import './LoginPage.css';

const initialFormData = {
  username: '',
  email: '',
  password: '',
  repeatPassword: '',
};

const Register = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Email validation
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    try {
      await registerApi({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation />
      <main className="container flex-grow-1 py-5">
        <div className="login-grid">
          <div className="d-flex align-items-center justify-content-center" style={{flex: 1}}>
            <img
              src={process.env.PUBLIC_URL + '/images/login.png'}
              alt="Register Illustration"
              className="login-image"
            />
          </div>
          <div className="row justify-content-center" style={{flex: 1}}>
            <div className="col-md-12 col-lg-10">
              <div className="card shadow p-4">
                <h3 className="mb-4 text-center">Register</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      minLength="6"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Repeat Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="repeatPassword"
                      value={formData.repeatPassword}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      minLength="6"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                </form>
                <div className="mt-3 text-center">
                  <a href="/login">Already have an account? Login</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;