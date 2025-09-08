import axiosInstance from '../axios/axios';

const userRepository = {
  login: async (formData) => {
    try {
      const response = await axiosInstance.post('/users/login', formData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  register: async (formData) => {
    try {
      const payload = {
        firstName: formData.name,
        lastName: formData.surname,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        education: formData.education || '',
        profileImageUrl: formData.profileImageUrl || '',
        role: formData.role || 'USER'
      };
      const response = await axiosInstance.post('/users/register', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/api/auth/current-user');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await axiosInstance.put('/api/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default userRepository;
