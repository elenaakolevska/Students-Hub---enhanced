import axiosInstance from "../axios/axios";

const postRepository = {
    findAll: () => axiosInstance.get('/posts'),

    findById: (id) => axiosInstance.get(`/posts/${id}`),

    save: (post) => axiosInstance.post('/posts/add', post),

    update: (id, post) => axiosInstance.put(`/posts/edit/${id}`, post),

    delete: (id) => axiosInstance.delete(`/posts/delete/${id}`),

    findByUsername: (username) => axiosInstance.get(`/posts/user/${username}`),

    getMyPosts: () => axiosInstance.get('/posts/my-posts'),

    getLatest: () => axiosInstance.get('/posts/latest'),

    getLatestPerCategory: () => axiosInstance.get('/posts/latest-per-category')
};

export default postRepository;
