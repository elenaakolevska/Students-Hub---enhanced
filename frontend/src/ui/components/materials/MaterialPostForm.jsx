import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import materialPostRepository from '../../../repository/materialPostRepository.js';
import authContext from '../../../contexts/authContext.js';

const MaterialPostForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(authContext);
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        rating: '',
        category: '',
        tagsString: '',
        file: null,
        originalFileName: ''
    });
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await materialPostRepository.getAllSubjects();
                setSubjects(response.data);
            } catch (err) {
                setError('Грешка при вчитување на предметите');
            }
        };
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (isEdit) {
            const fetchPost = async () => {
                try {
                    const response = await materialPostRepository.findById(id);
                    const post = response.data;
                    setFormData({
                        title: post.title || '',
                        description: post.description || '',
                        subject: post.subject || '',
                        rating: post.rating || '',
                        category: post.category || '',
                        tagsString: post.tags ? post.tags.join(',') : '',
                        file: null,
                        originalFileName: post.originalFileName || ''
                    });
                } catch (err) {
                    setError('Грешка при вчитување на материјалот');
                }
            };
            fetchPost();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            file: file,
            originalFileName: file ? file.name : ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('subject', formData.subject);
            data.append('rating', formData.rating);
            data.append('category', formData.category);
            data.append('originalFileName', formData.originalFileName);
            if (formData.file) data.append('file', formData.file);
            // Convert tagsString to array and append as comma-separated string
            const tagsArray = formData.tagsString.split(',').map(t => t.trim()).filter(Boolean);
            if (tagsArray.length > 0) {
                data.append('tags', tagsArray.join(','));
            }
            if (isEdit) {
                await materialPostRepository.update(id, data);
            } else {
                await materialPostRepository.save(data);
            }
            navigate('/material-posts');
        } catch (err) {
            setError('Грешка при зачувување на материјалот');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="container my-5">
                <div className="alert alert-warning text-center">
                    Мора да бидете најавени за да креирате материјал.
                </div>
            </div>
        );
    }

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
                    {isEdit ? 'Измени материјал' : 'Креирај нов материјал'}
                </h2>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Наслов:</label>
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
                        <label htmlFor="description" className="form-label">Опис:</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="subject" className="form-label">Предмет:</label>
                        <select
                            className="form-select"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Избери предмет</option>
                            {subjects.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="rating" className="form-label">Оцена:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="rating"
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            min="0"
                            max="10"
                            step="0.1"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">Категорија:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tags" className="form-label">Тагови (разделени со запирка):</label>
                        <input
                            type="text"
                            className="form-control"
                            id="tags"
                            name="tagsString"
                            value={formData.tagsString}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="file" className="form-label">Датотека:</label>
                        <input
                            type="file"
                            className="form-control"
                            id="file"
                            name="file"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.txt,.jpg,.png,.jpeg"
                        />
                        {formData.originalFileName && (
                            <small className="text-muted">Избрана датотека: {formData.originalFileName}</small>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? 'Се зачувува...' : isEdit ? 'Зачувај промени' : 'Креирај'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MaterialPostForm;
