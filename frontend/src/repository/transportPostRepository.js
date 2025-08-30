import axiosInstance from "../axios/axios";

const BASE_URL = "/api/transport-posts";

const transportPostRepository = {
    findAll: () => axiosInstance.get(`${BASE_URL}`),
    findById: (id) => axiosInstance.get(`${BASE_URL}/${id}`),
    save: (transportPost) => axiosInstance.post(`${BASE_URL}/add`, transportPost),
    update: (id, transportPost) => axiosInstance.put(`${BASE_URL}/edit/${id}`, transportPost),
    delete: (id) => axiosInstance.delete(`${BASE_URL}/delete/${id}`),
    findByLocation: (locationFrom, locationTo) => {
        const params = [];
        if (locationFrom) params.push(`locationFrom=${encodeURIComponent(locationFrom)}`);
        if (locationTo) params.push(`locationTo=${encodeURIComponent(locationTo)}`);
        const query = params.length ? `?${params.join('&')}` : '';
        return axiosInstance.get(`${BASE_URL}${query}`);
    }
};

export default transportPostRepository;

