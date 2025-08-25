import axiosInstance from "../axios/axios";

const internshipPostRepository = {
    findAll: (faculty = null) => {
        const params = faculty ? `?faculty=${faculty}` : '';
        return axiosInstance.get(`/internship-posts${params}`);
    },

    findById: (id) => axiosInstance.get(`/internship-posts/${id}`),

    save: (internshipPost) => axiosInstance.post('/internship-posts/add', internshipPost),

    update: (id, internshipPost) => axiosInstance.put(`/internship-posts/edit/${id}`, internshipPost),

    delete: (id) => axiosInstance.delete(`/internship-posts/delete/${id}`),

    findByFaculty: (faculty) => axiosInstance.get(`/internship-posts/faculty/${faculty}`)
};

export default internshipPostRepository;