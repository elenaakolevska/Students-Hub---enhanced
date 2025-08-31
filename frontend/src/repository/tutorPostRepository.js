import axiosInstance from "../axios/axios";

const tutorPostRepository = {
    findAll: (tutorName = null, subject = null) => {
        const params = new URLSearchParams();
        if (tutorName) params.append('tutorName', tutorName);
        if (subject) params.append('subject', subject);
        const queryString = params.toString();
        return axiosInstance.get(`/api/tutor-posts${queryString ? `?${queryString}` : ''}`);
    },

    findById: (id) => axiosInstance.get(`/api/tutor-posts/${id}`),

    save: (tutorPost) => axiosInstance.post('/api/tutor-posts/add', tutorPost),

    update: (id, tutorPost) => {
        return axiosInstance.put(`/api/tutor-posts/edit/${id}`, tutorPost);
    },

    delete: (id) => axiosInstance.delete(`/api/tutor-posts/delete/${id}`),

    search: (tutorName, subject) => {
        const params = new URLSearchParams();
        if (tutorName) params.append('tutorName', tutorName);
        if (subject) params.append('subject', subject);
        return axiosInstance.get(`/api/tutor-posts/search?${params.toString()}`);
    }
};

export default tutorPostRepository;