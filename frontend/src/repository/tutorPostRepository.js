import axiosInstance from "../axios/axios";

const tutorPostRepository = {
    findAll: (tutorName = null, subject = null) => {
        const params = new URLSearchParams();
        if (tutorName) params.append('tutorName', tutorName);
        if (subject) params.append('subject', subject);
        const queryString = params.toString();
        return axiosInstance.get(`/tutor-posts${queryString ? `?${queryString}` : ''}`);
    },

    findById: (id) => axiosInstance.get(`/tutor-posts/${id}`),

    save: (tutorPost) => axiosInstance.post('/tutor-posts/add', tutorPost),

    update: (id, tutorPost) => axiosInstance.put(`/tutor-posts/edit/${id}`, tutorPost),

    delete: (id) => axiosInstance.delete(`/tutor-posts/delete/${id}`),

    search: (tutorName, subject) => {
        const params = new URLSearchParams();
        if (tutorName) params.append('tutorName', tutorName);
        if (subject) params.append('subject', subject);
        return axiosInstance.get(`/tutor-posts/search?${params.toString()}`);
    }
};

export default tutorPostRepository;