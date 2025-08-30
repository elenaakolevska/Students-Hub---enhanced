import axiosInstance from "../axios/axios";

const eventPostRepository = {
    findAll: (category = null) => {
        const params = category ? `?category=${category}` : '';
        return axiosInstance.get(`/api/event-posts${params}`);
    },

    findById: (id) => axiosInstance.get(`/api/event-posts/${id}`),

    save: (eventPost) => axiosInstance.post('/api/event-posts/add', eventPost),

    update: (id, eventPost) => axiosInstance.put(`/api/event-posts/edit/${id}`, eventPost),

    delete: (id) => axiosInstance.delete(`/api/event-posts/delete/${id}`),

    findByCategory: (category) => axiosInstance.get(`/api/event-posts/category/${category}`)
};

export default eventPostRepository;