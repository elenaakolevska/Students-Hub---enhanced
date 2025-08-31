import axiosInstance from "../axios/axios";

const postRepository = {
    findAll: () => axiosInstance.get('/api/posts'),

    findById: (id) => axiosInstance.get(`/api/posts/${id}`),

    save: (post) => axiosInstance.post('/api/posts/add', post),

    update: (id, post) => axiosInstance.put(`/api/posts/edit/${id}`, post),

    delete: (id) => axiosInstance.delete(`/api/posts/delete/${id}`),

    findByUsername: (username) => axiosInstance.get(`/api/posts/user/${username}`),

    getMyPosts: () => axiosInstance.get('/api/posts/my-posts'),

    getLatest: () => axiosInstance.get('/api/posts/latest'),

    getLatestPerCategory: () => axiosInstance.get('/api/posts/latest-per-category')
};

export default postRepository;
