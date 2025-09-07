import axiosInstance from '../axios/axios';

const favoriteRepository = {
    getMyFavorites: async () => {
        try {
            const response = await axiosInstance.get('/api/favorites');
            return response;
        } catch (error) {
            console.error('Error fetching favorites:', error);
            throw error;
        }
    },

    addFavorite: async (postId) => {
        try {
            const response = await axiosInstance.post(`/api/favorites/add/${postId}`);
            return response;
        } catch (error) {
            console.error('Error adding favorite:', error);
            throw error;
        }
    },

    addFavoriteWithBody: async (postId) => {
        try {
            const response = await axiosInstance.post('/api/favorites/add', {
                postId: postId
            });
            return response;
        } catch (error) {
            console.error('Error adding favorite:', error);
            throw error;
        }
    },

    removeFavorite: async (favoriteId) => {
        try {
            const response = await axiosInstance.delete(`/api/favorites/${favoriteId}`);
            return response;
        } catch (error) {
            console.error('Error removing favorite:', error);
            throw error;
        }
    },

    checkIfFavorited: async (postId) => {
        try {
            const response = await axiosInstance.get(`/api/favorites/check/${postId}`);
            return response;
        } catch (error) {
            console.error('Error checking favorite status:', error);
            throw error;
        }
    }
};

export default favoriteRepository;
