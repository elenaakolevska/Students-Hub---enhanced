import axiosInstance from "../axios/axios";

const housingPostRepository = {
    findAll: (municipality = null) => {
        const params = municipality ? `?municipality=${municipality}` : '';
        return axiosInstance.get(`/api/housing-posts${params}`);
    },

    findById: (id) => axiosInstance.get(`/api/housing-posts/${id}`),

    save: (housingPost) => axiosInstance.post('/api/housing-posts/add', housingPost),

    update: (id, housingPost) => axiosInstance.put(`/api/housing-posts/edit/${id}`, housingPost),

    delete: (id) => axiosInstance.delete(`/api/housing-posts/delete/${id}`),

    findByMunicipality: (municipality) => axiosInstance.get(`/api/housing-posts/municipality/${municipality}`),

    getAllMunicipalities: () => axiosInstance.get('/api/housing-posts/municipalities')
};

export default housingPostRepository;