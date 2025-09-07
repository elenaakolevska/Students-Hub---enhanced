import axiosInstance from "../axios/axios";

const BASE_URL = "/api/material-posts";

const materialPostRepository = {
    findAll: (subject = null) => {
        const params = subject ? `?subject=${encodeURIComponent(subject)}` : '';
        return axiosInstance.get(`${BASE_URL}${params}`);
    },

    findById: (id) => axiosInstance.get(`${BASE_URL}/${id}`),
    save: (materialPost) => axiosInstance.post(`${BASE_URL}/add`, materialPost),
    saveWithFile: (formData) => {
        return axiosInstance.post(`${BASE_URL}/add-with-file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    update: (id, materialPost) => axiosInstance.put(`${BASE_URL}/edit/${id}`, materialPost),
    delete: (id) => axiosInstance.delete(`${BASE_URL}/delete/${id}`),
    findBySubject: (subject) => axiosInstance.get(`${BASE_URL}/subject/${encodeURIComponent(subject)}`),
    getAllSubjects: () => axiosInstance.get(`${BASE_URL}/subjects`),
    download: (id) => axiosInstance.get(`${BASE_URL}/download/${id}`, { responseType: 'blob' }),
};

export default materialPostRepository;
