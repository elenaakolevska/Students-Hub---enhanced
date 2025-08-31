import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import useHousingPosts from '../../../hooks/useHousingPosts.js';
import authContext from '../../../contexts/authContext';
import favoriteRepository from '../../../repository/favoriteRepository';
import { toast } from 'react-toastify';

const HousingPostList = () => {
    const [selectedMunicipality, setSelectedMunicipality] = useState('');
    const { housingPosts, municipalities, loading, error } = useHousingPosts(selectedMunicipality);
    const { user } = useContext(authContext);

    const handleMunicipalityChange = (e) => {
        setSelectedMunicipality(e.target.value);
    };

    const addToFavorites = async (postId) => {
        console.log('Adding to favorites:', postId);
        
        if (!user || !user.sub) {
            toast.error('Мора да бидете најавени за да додадете во омилени');
            return;
        }
        
        try {
            const response = await favoriteRepository.addFavorite(user.sub, postId);
            toast.success('Додадено во омилени');
        } catch (err) {
            toast.error('Грешка при додавање во омилени');
            console.error('Error adding to favorites:', err);
        }
    };

    if (loading) {
        return (
            <div className="container my-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Вчитување...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container my-5">
                <div className="alert alert-danger" role="alert">
                    Грешка: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <div className="section-header mt-5" style={{
                padding: '2rem 0',
                position: 'relative',
                marginBottom: '3rem',
                textAlign: 'center'
            }}>
                <h2 className="section-title" style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    color: '#2c3e50',
                    position: 'relative',
                    display: 'inline-block',
                    paddingBottom: '1rem'
                }}>
                    Домување
                    <div style={{
                        content: '',
                        position: 'absolute',
                        left: '50%',
                        bottom: 0,
                        transform: 'translateX(-50%)',
                        width: '60px',
                        height: '4px',
                        background: '#fd7e14',
                        borderRadius: '2px'
                    }}></div>
                </h2>
                <p className="section-subtitle" style={{
                    color: '#6c757d',
                    fontSize: '1.1rem',
                    marginTop: '1rem',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    Пронајдете го идеалниот дом или соба за вашите студентски потреби
                </p>
            </div>

            <div className="mb-4 text-end">
                <Link to="/housing-posts/create" className="btn btn-primary">
                    + Додади нова објава за домување
                </Link>
            </div>

            <form className="row g-3 align-items-center mb-4">
                <div className="col-auto">
                    <label htmlFor="municipality" className="col-form-label">Филтер по општина:</label>
                </div>
                <div className="col-auto">
                    <select
                        name="municipality"
                        id="municipality"
                        className="form-select"
                        value={selectedMunicipality}
                        onChange={handleMunicipalityChange}
                    >
                        <option value="">Сите општини</option>
                        {municipalities.map(municipality => (
                            <option key={municipality} value={municipality}>{municipality}</option>
                        ))}
                    </select>
                </div>
            </form>

            {housingPosts.length === 0 ? (
                <div className="alert alert-info text-center">
                    Нема пронајдени објави за домување.
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {housingPosts.map(post => (
                        <div key={post.id} className="col">
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text"><strong>Локација:</strong> <span>{post.location}</span></p>
                                    <p className="card-text"><strong>Општина:</strong> <span>{post.municipality}</span></p>
                                    <p className="card-text"><strong>Цена:</strong> <span>{post.price} ден.</span></p>
                                    <p className="card-text"><strong>Опис:</strong> <span>{post.description}</span></p>

                                    {post.tags && post.tags.length > 0 && (
                                        <div className="mb-2">
                                            {post.tags.map((tag, index) => (
                                                <span key={index} className="badge bg-secondary me-1">{tag}</span>
                                            ))}
                                        </div>
                                    )}

                                    <Link
                                        to={`/housing-posts/${post.id}`}
                                        className="btn btn-info mt-auto text-white"
                                    >
                                        Види детали
                                    </Link>

                                    <button
                                        onClick={() => addToFavorites(post.id)}
                                        className="btn btn-outline-danger w-100 mt-2"
                                    >
                                        ♥ Додај во омилени
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HousingPostList;