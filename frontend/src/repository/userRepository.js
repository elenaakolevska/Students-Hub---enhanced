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
  },

  searchUsers: async (searchTerm) => {
    try {
      console.log('Searching users with term:', searchTerm);
      // Try the new public endpoint which should be accessible without authentication
      const response = await axiosInstance.get(`/api/public/search-users?query=${searchTerm}`);
      console.log('Search response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in searchUsers:', error);
      console.log('Falling back to original endpoint');
      
      // If the new endpoint fails, fall back to the original one
      try {
        const fallbackResponse = await axiosInstance.get(`/api/chat/search-users?query=${searchTerm}`);
        console.log('Fallback search response:', fallbackResponse.data);
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('Error in fallback search:', fallbackError);
        throw fallbackError;
      }
    }
  }
};

export default userRepository;
