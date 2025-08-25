import axiosInstance from "../axios/axios";

const housingPostRepository = {
    findAll: (municipality = null) => {
        const params = municipality ? `?municipality=${municipality}` : '';
        return axiosInstance.get(`/housing-posts${params}`);
    },

    findById: (id) => axiosInstance.get(`/housing-posts/${id}`),

    save: (housingPost) => axiosInstance.post('/housing-posts/add', housingPost),

    update: (id, housingPost) => axiosInstance.put(`/housing-posts/edit/${id}`, housingPost),

    delete: (id) => axiosInstance.delete(`/housing-posts/delete/${id}`),

    findByMunicipality: (municipality) => axiosInstance.get(`/housing-posts/municipality/${municipality}`),

    getAllMunicipalities: () => axiosInstance.get('/housing-posts/municipalities')
};

export default housingPostRepository;