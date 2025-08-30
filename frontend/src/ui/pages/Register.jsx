import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';
import Footer from '../Footer';
import { register as registerApi } from '../../repository/userRepository';

const initialFormData = {
  name: '',
  surname: '',
  username: '',
  email: '',
  password: '',
  repeatPassword: '',
  role: 'ROLE_USER',
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

    // Validation
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
      console.log('Sending registration request...', formData);
      const response = await registerApi(formData);
      console.log('Registration response:', response);
      
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      
      // Better error handling
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 400) {
          setError(data?.message || 'Invalid registration data. Please check your inputs.');
        } else if (status === 409) {
          setError('Username or email already exists. Please choose different ones.');
        } else if (status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Registration failed with status: ${status}`);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError('No response from server. Please check if the backend is running.');
      } else {
        // Something else went wrong
        setError(`Registration failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation />
      <main className="container flex-grow-1 py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow p-4">
              <h3 className="mb-4 text-center">Register</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Surname</label>
                  <input
                    type="text"
                    className="form-control"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
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
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="ROLE_USER">User</option>
                    <option value="ROLE_ADMIN">Administrator</option>
                  </select>
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
      </main>
      <Footer />
    </div>
  );
};

export default Register;