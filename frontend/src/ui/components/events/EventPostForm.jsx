import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventPostRepository from '../../../repository/eventPostRepository.js';
import authContext from '../../../contexts/authContext.js';

const EventPostForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(authContext);
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventCategory: '',
        location: '',
        isFree: true,
        price: '',
        organizer: '',
        imageUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Event categories based on backend enum
    const eventCategories = [
        'CONFERENCE',
        'WORKSHOP',
        'SEMINAR',
        'NETWORKING',
        'COMPETITION',
        'PARTY',
        'CULTURAL',
        'SPORTS',
        'OTHER'
    ];

    useEffect(() => {
        if (isEdit) {
            const fetchPost = async () => {
                try {
                    const response = await eventPostRepository.findById(id);
                    const post = response.data;
                    setFormData({
                        title: post.title || '',
                        description: post.description || '',
                        eventCategory: post.eventCategory || '',
                        location: post.location || '',
                        isFree: post.isFree !== undefined ? post.isFree : true,
                        price: post.price || '',
                        organizer: post.organizer || '',
                        imageUrl: post.imageUrl || ''
                    });
                } catch (err) {
                    setError('Грешка при вчитување на настанот');
                }
            };
            fetchPost();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = {
                ...formData,
                price: formData.isFree ? null : (formData.price ? parseInt(formData.price) : null)
            };
            if (isEdit) {
                await eventPostRepository.update(id, payload);
            } else {
                await eventPostRepository.save({ ...payload, userId: user?.id });
            }
            navigate('/event-posts');
        } catch (err) {
            setError('Грешка при зачувување на настанот');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="container my-5">
                <div className="alert alert-warning text-center">
                    Мора да бидете најавени за да креирате настан.
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
                    {isEdit ? 'Измени настан' : 'Креирај нов настан'}
                </h2>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="needs-validation">
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
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="eventCategory" className="form-label">Категорија на настан:</label>
                        <select
                            className="form-select"
                            id="eventCategory"
                            name="eventCategory"
                            value={formData.eventCategory}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Избери категорија</option>
                            {eventCategories.map(category => (
                                <option key={category} value={category}>
                                    {category.charAt(0) + category.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="location" className="form-label">Локација:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="organizer" className="form-label">Организатор:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="organizer"
                            name="organizer"
                            value={formData.organizer}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="isFree"
                                name="isFree"
                                checked={formData.isFree}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="isFree">
                                Бесплатен настан
                            </label>
                        </div>
                    </div>
                    {!formData.isFree && (
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Цена (денари):</label>
                            <input
                                type="number"
                                className="form-control"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                required={!formData.isFree}
                            />
                        </div>
                    )}
                    <div className="mb-3">
                        <label htmlFor="imageUrl" className="form-label">Слика (URL):</label>
                        <input
                            type="url"
                            className="form-control"
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                        />
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

export default EventPostForm;
