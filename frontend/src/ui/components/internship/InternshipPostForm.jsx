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
                await internshipPostRepository.save(formData);
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
        <div className="container">
            <div style={{
                maxWidth: '600px',
                margin: 'auto',
                padding: '2rem',
                background: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 0.25rem 1rem rgba(0,0,0,0.1)',
                marginTop: '3rem',
                marginBottom: '3rem'
            }}>
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    fontWeight: '600'
                }}>
                    {isEdit ? 'Уреди Пракса' : 'Додади Нова Пракса'}
                </h2>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="needs-validation">
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Наслов</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="company" className="form-label">Компанија</label>
                        <input
                            type="text"
                            className="form-control"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="facultyFilter" className="form-label">Факултет</label>
                        <input
                            type="text"
                            className="form-control"
                            id="facultyFilter"
                            name="facultyFilter"
                            value={formData.facultyFilter}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="position" className="form-label">Позиција</label>
                        <input
                            type="text"
                            className="form-control"
                            id="position"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Опис</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="logoUrl" className="form-label">Лого URL</label>
                        <input
                            type="url"
                            className="form-control"
                            id="logoUrl"
                            name="logoUrl"
                            value={formData.logoUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/logo.png"
                        />
                        {formData.logoUrl && (
                            <div className="mt-2">
                                <img
                                    src={formData.logoUrl}
                                    alt="Company Logo Preview"
                                    className="img-thumbnail"
                                    style={{ maxHeight: '150px', maxWidth: '100%' }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://placehold.co/300x150?text=Invalid+Logo+URL";
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? 'Се зачувува...' : (isEdit ? 'Ажурирај' : 'Зачувај')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InternshipPostForm;
