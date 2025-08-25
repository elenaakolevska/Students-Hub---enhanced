import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import internshipPostRepository from '../../../repository/internshipPostRepository.js';
import authContext from '../../../contexts/authContext.js';

const InternshipPostForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(authContext);
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        company: '',
        facultyFilter: '',
        position: '',
        description: '',
        logoUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            const fetchPost = async () => {
                try {
                    const response = await internshipPostRepository.findById(id);
                    setFormData(response.data);
                } catch (err) {
                    setError('Грешка при вчитување на праксата');
                    console.error('Error fetching internship post:', err);
                }
            };
            fetchPost();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isEdit) {
                await internshipPostRepository.update(id, formData);
            } else {
                await internshipPostRepository.save({ ...formData, userId: user.id });
            }
            navigate('/internships');
        } catch (err) {
            setError('Грешка при зачувување на праксата');
            console.error('Error saving internship post:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="internship-post-form">
            <h2>{isEdit ? 'Уреди пракса' : 'Креирај пракса'}</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Наслов"
                    required
                />
                <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Компанија"
                    required
                />
                <input
                    type="text"
                    name="facultyFilter"
                    value={formData.facultyFilter}
                    onChange={handleChange}
                    placeholder="Факултет (филтер)"
                />
                <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Позиција"
                    required
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Опис"
                    required
                />
                <input
                    type="text"
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    placeholder="Лого URL"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Се зачувува...' : isEdit ? 'Зачувај промени' : 'Креирај'}
                </button>
            </form>
        </div>
    );
};

export default InternshipPostForm;
