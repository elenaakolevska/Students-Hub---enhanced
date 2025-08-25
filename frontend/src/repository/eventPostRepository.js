import axiosInstance from "../axios/axios";

const eventPostRepository = {
    findAll: (category = null) => {
        const params = category ? `?category=${category}` : '';
        return axiosInstance.get(`/event-posts${params}`);
    },

    findById: (id) => axiosInstance.get(`/event-posts/${id}`),

    save: (eventPost) => axiosInstance.post('/event-posts/add', eventPost),

    update: (id, eventPost) => axiosInstance.put(`/event-posts/edit/${id}`, eventPost),

    delete: (id) => axiosInstance.delete(`/event-posts/delete/${id}`),

    findByCategory: (category) => axiosInstance.get(`/event-posts/category/${category}`)
};

export default eventPostRepository;