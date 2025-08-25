import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import transportPostRepository from '../../../repository/transportPostRepository.js';
import authContext from '../../../contexts/authContext.js';

const TransportPostForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(authContext);
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        providerName: '',
        locationFrom: '',
        locationTo: '',
        price: '',
        departureDatetime: '',
        contactInfo: '',
        description: '',
        category: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            const fetchPost = async () => {
                try {
                    const response = await transportPostRepository.findById(id);
                    const post = response.data;
                    setFormData({
                        title: post.title || '',
                        providerName: post.providerName || '',
                        locationFrom: post.locationFrom || '',
                        locationTo: post.locationTo || '',
                        price: post.price || '',
                        departureDatetime: post.departureDatetime ? post.departureDatetime.slice(0, 16) : '',
                        contactInfo: post.contactInfo || '',
                        description: post.description || '',
                        category: post.category || ''
                    });
                } catch (err) {
                    setError('Грешка при вчитување на понудата за превоз');
                }
            };
            fetchPost();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = {
                ...formData,
                price: formData.price ? parseInt(formData.price) : null,
                departureDatetime: formData.departureDatetime ? new Date(formData.departureDatetime).toISOString() : null
            };
            if (isEdit) {
                await transportPostRepository.update(id, payload);
            } else {
                await transportPostRepository.save({ ...payload, userId: user?.id });
            }
            navigate('/transport-posts');
        } catch (err) {
            setError('Грешка при зачувување на понудата за превоз');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="container my-5">
                <div className="alert alert-warning text-center">
                    Мора да бидете најавени за да креирате понуда за превоз.
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
                    {isEdit ? 'Измени понуда за превоз' : 'Креирај нова понуда за превоз'}
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
                        <label htmlFor="providerName" className="form-label">Провајдер:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="providerName"
                            name="providerName"
                            value={formData.providerName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="locationFrom" className="form-label">Од локација:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="locationFrom"
                            name="locationFrom"
                            value={formData.locationFrom}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="locationTo" className="form-label">До локација:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="locationTo"
                            name="locationTo"
                            value={formData.locationTo}
                            onChange={handleChange}
                            required
                        />
                    </div>
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
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="departureDatetime" className="form-label">Време на поаѓање:</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            id="departureDatetime"
                            name="departureDatetime"
                            value={formData.departureDatetime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="contactInfo" className="form-label">Контакт:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="contactInfo"
                            name="contactInfo"
                            value={formData.contactInfo}
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

export default TransportPostForm;

