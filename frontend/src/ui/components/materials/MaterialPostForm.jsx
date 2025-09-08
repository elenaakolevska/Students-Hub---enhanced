import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import materialPostRepository from '../../../repository/materialPostRepository.js';

const MaterialPostForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
                        tagsString: post.tags ? post.tags.join(', ') : '',
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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                file: file,
                originalFileName: file.name
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('subject', formData.subject);
            formDataToSend.append('rating', formData.rating);
            formDataToSend.append('category', formData.category);

            const tags = formData.tagsString.split(',').map(t => t.trim()).filter(Boolean);
            formDataToSend.append('tags', JSON.stringify(tags));

            if (formData.file) {
                formDataToSend.append('file', formData.file);
            }

            if (isEdit) {
                await materialPostRepository.update(id, formDataToSend);
            } else {
                if (formData.file) {
                    const response = await materialPostRepository.saveWithFile(formDataToSend);
                    const newId = response?.data?.id;
                    if (newId) {
                        navigate(`/material-posts/${newId}`);
                    } else {
                        navigate('/material-posts');
                    }
                } else {
                    const postData = {
                        title: formData.title,
                        description: formData.description,
                        subject: formData.subject,
                        rating: formData.rating,
                        category: formData.category,
                        tags: tags
                    };
                    const response = await materialPostRepository.save(postData);
                    const newId = response?.data?.id;
                    if (newId) {
                        navigate(`/material-posts/${newId}`);
                    } else {
                        navigate('/material-posts');
                    }
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Грешка при зачувување');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="mb-0">{isEdit ? 'Уреди материјал' : 'Додади нов материјал'}</h2>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
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
                                        placeholder="Внесете наслов на материјалот"
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
                                        <option value="">Изберете предмет</option>
                                        {subjects.map(subject => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        ))}
                                    </select>
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
                                        required
                                        placeholder="Пр. Презентации, Книги, Белешки"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="rating" className="form-label">Оцена (1-5):</label>
                                    <select
                                        className="form-select"
                                        id="rating"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Изберете оцена</option>
                                        <option value="1">1 - Слаба</option>
                                        <option value="2">2 - Добра</option>
                                        <option value="3">3 - Многу добра</option>
                                        <option value="4">4 - Одлична</option>
                                        <option value="5">5 - Совршена</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Опис:</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        required
                                        placeholder="Опишете го материјалот..."
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="file" className="form-label">Прикачи датотека:</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                                    />
                                    {formData.originalFileName && (
                                        <small className="form-text text-muted">
                                            Тековна датотека: {formData.originalFileName}
                                        </small>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="tagsString" className="form-label">Тагови (одделени со запирка):</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tagsString"
                                        name="tagsString"
                                        value={formData.tagsString}
                                        onChange={handleChange}
                                        placeholder="пр. презентации, скрипти, испити"
                                    />
                                    <small className="form-text text-muted">
                                        Одделете ги таговите со запирка
                                    </small>
                                </div>

                                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                    <button
                                        type="button"
                                        className="btn btn-secondary me-md-2"
                                        onClick={() => navigate('/material-posts')}
                                    >
                                        Откажи
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Се зачувува...' : (isEdit ? 'Ажурирај' : 'Создади')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialPostForm;
