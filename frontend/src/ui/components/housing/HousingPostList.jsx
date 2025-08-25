import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useHousingPosts from '../../../hooks/useHousingPosts.js';

const HousingPostList = () => {
    const [selectedMunicipality, setSelectedMunicipality] = useState('');
    const { housingPosts, municipalities, loading, error } = useHousingPosts(selectedMunicipality);

    const handleMunicipalityChange = (e) => {
        setSelectedMunicipality(e.target.value);
    };

    const addToFavorites = async (postId) => {
        console.log('Adding to favorites:', postId);
    };

    if (loading) {
        return (
            <div className="container my-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container my-5">
                <div className="alert alert-danger" role="alert">
                    Грешка при вчитување: {error}
                </div>
            </div>
        );
    }

    return (
        <section className="container my-5">
            <div className="section-header" style={{
                padding: '2rem 0',
                textAlign: 'center',
                marginBottom: '3rem'
            }}>
                <h2 className="section-title" style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    color: '#2c3e50',
                    position: 'relative',
                    display: 'inline-block',
                    paddingBottom: '1rem'
                }}>
                    Сместување
                </h2>
                <p className="section-subtitle" style={{
                    color: '#6c757d',
                    fontSize: '1.1rem',
                    marginTop: '1rem',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    Пронајди го идеалното сместување за тебе
                </p>
            </div>

            <div className="mb-4 text-end">
                <Link to="/housing-posts/create" className="btn btn-primary">
                    + Додади сместување
                </Link>
            </div>

            <form className="row g-3 align-items-center mb-4">
                <div className="col-auto">
                    <label htmlFor="municipality" className="col-form-label">Филтер по gemeente:</label>
                </div>
                <div className="col-auto">
                    <select
                        name="municipality"
                        id="municipality"
                        className="form-select"
                        value={selectedMunicipality}
                        onChange={handleMunicipalityChange}
                    >
                        <option value="">Сите</option>
                        {municipalities.map(mun => (
                            <option key={mun} value={mun}>{mun}</option>
                        ))}
                    </select>
                </div>
            </form>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {housingPosts.map(post => (
                    <div key={post.id} className="col">
                        <div className="card h-100 shadow-sm">
                            <img
                                src={post.images?.[0] || '/images/default-housing.jpg'}
                                className="card-img-top"
                                alt="Слика од сместување"
                                style={{ height: '200px', objectFit: 'cover' }}
                            />

                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text mb-1">
                                    <strong>Локација:</strong> <span>{post.location}</span>
                                </p>
                                <p className="card-text mb-1">
                                    <strong>Општина:</strong> <span>{post.municipality}</span>
                                </p>
                                <p className="card-text mb-1">
                                    <strong>Цена:</strong> <span>{post.price} ден.</span>
                                </p>
                                <p className="card-text mb-1">
                                    <strong>Опис:</strong> <span>{post.description}</span>
                                </p>
                                <p className="card-text mb-3">
                                    <strong>Статус:</strong>
                                    <span>{post.found ? ' Веќе најдено' : ' Слободно'}</span>
                                </p>

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
                                    Додај во омилени
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {housingPosts.length === 0 && (
                <div className="text-center mt-5">
                    <p className="text-muted">Нема пронајдени сместувања за избраната општина.</p>
                </div>
            )}
        </section>
    );
};

export default HousingPostList;