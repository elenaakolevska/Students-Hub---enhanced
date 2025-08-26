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
                await transportPostRepository.update(id, formData);
            } else {
                await transportPostRepository.save(formData);
            }
            navigate('/transport-posts');
        } catch (err) {
            setError('Грешка при зачувување на понудата за превоз');
            console.error('Error saving transport post:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <h2>{isEdit ? 'Уреди Понуда за Превоз' : 'Додади Нова Понуда за Превоз'}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
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
                    <label htmlFor="providerName" className="form-label">Име на понудувач</label>
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
                    <label htmlFor="locationFrom" className="form-label">Од локација</label>
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
                    <label htmlFor="locationTo" className="form-label">До локација</label>
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
                    <label htmlFor="price" className="form-label">Цена</label>
                    <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="departureDatetime" className="form-label">Датум и време на тргање</label>
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
                    <label htmlFor="contactInfo" className="form-label">Контакт информаци��</label>
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
                    <label htmlFor="category" className="form-label">Категорија</label>
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
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Се зачувува...' : (isEdit ? 'Ажурирај' : 'Зачувај')}
                </button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate('/transport-posts')}
                >
                    Откажи
                </button>
            </form>
        </div>
    );
};

export default TransportPostForm;
