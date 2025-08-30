import axios from '../axios/axios';

const API_URL = '/users'; // Adjust if your backend uses a different path

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data;
};


export const register = async (formData) => {
  // Map frontend fields to backend DTO
  const payload = {
    firstName: formData.name,
    lastName: formData.surname,
    username: formData.username,
    email: formData.email,
    password: formData.password,
    education: '',
    profileImageUrl: '',
    createdAt: null,
    role: formData.role
  };
  const response = await axios.post('/users/register', payload);
  return response.data;
};

export default {
  login,
  register,
};
