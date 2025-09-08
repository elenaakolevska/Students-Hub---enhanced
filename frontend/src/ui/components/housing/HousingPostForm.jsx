import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import housingPostRepository from '../../../repository/housingPostRepository.js';
import authContext from '../../../contexts/authContext.js';

const HousingPostForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(authContext);
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        municipality: '',
        price: 0,
        description: '',
        found: false,
        images: []
    });
    const [imagesText, setImagesText] = useState('');
    const [municipalities, setMunicipalities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMunicipalities = async () => {
            try {
                const response = await housingPostRepository.getAllMunicipalities();
                setMunicipalities(response.data);
            } catch (err) {
                console.error('Error fetching municipalities:', err);
            }
        };

        fetchMunicipalities();

        if (isEdit) {
            const fetchPost = async () => {
                try {
                    const response = await housingPostRepository.findById(id);
                    const post = response.data;
                    setFormData(post);
                    setImagesText(post.images ? post.images.join(', ') : '');
                } catch (err) {
                    setError('Грешка при вчитување на сместувањето');
                    console.error('Error fetching housing post:', err);
                }
            };
            fetchPost();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImagesChange = (e) => {
        const value = e.target.value;
        setImagesText(value);
        const imagesArray = value.split(',').map(img => img.trim()).filter(img => img);
        setFormData((prevData) => ({
            ...prevData,
            images: imagesArray
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isEdit) {
                await housingPostRepository.update(id, formData);
            } else {
                await housingPostRepository.save(formData);
            }
            navigate('/housing');
        } catch (err) {
            setError('Грешка при зачувување на сместувањето');
            console.error('Error saving housing post:', err);
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
                    {isEdit ? 'Уреди Сместување' : 'Додади Ново Сместување'}
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
                        <label htmlFor="location" className="form-label">Локација</label>
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
                        <label htmlFor="municipality" className="form-label">Општина</label>
                        <select
                            className="form-select"
                            id="municipality"
                            name="municipality"
                            value={formData.municipality}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Изберете општина</option>
                            {municipalities.map(municipality => (
                                <option key={municipality} value={municipality}>
                                    {municipality}
                                </option>
                            ))}
                        </select>
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
                        <label htmlFor="images" className="form-label">Слики (URL-ови одделени со запирка)</label>
                        <input
                            type="text"
                            className="form-control"
                            id="images"
                            name="images"
                            value={imagesText}
                            onChange={handleImagesChange}
                            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        />
                    </div>
                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="found"
                            name="found"
                            checked={formData.found}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="found">
                            Пронајдено
                        </label>
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

export default HousingPostForm;
