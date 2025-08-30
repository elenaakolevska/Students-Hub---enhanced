import axiosInstance from "../axios/axios";

const internshipPostRepository = {
    findAll: (faculty = null) => {
        const params = faculty ? `?faculty=${faculty}` : '';
        return axiosInstance.get(`/api/internship-posts${params}`);
    },

    findById: (id) => axiosInstance.get(`/api/internship-posts/${id}`),

    save: (internshipPost) => axiosInstance.post('/api/internship-posts/add', internshipPost),

    update: (id, internshipPost) => axiosInstance.put(`/api/internship-posts/edit/${id}`, internshipPost),

    delete: (id) => axiosInstance.delete(`/api/internship-posts/delete/${id}`),

    findByFaculty: (faculty) => axiosInstance.get(`/api/internship-posts/faculty/${faculty}`)
};

export default internshipPostRepository;