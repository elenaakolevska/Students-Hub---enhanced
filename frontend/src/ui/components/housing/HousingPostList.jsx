import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import useHousingPosts from '../../../hooks/useHousingPosts.js';
import authContext from '../../../contexts/authContext';
import favoriteRepository from '../../../repository/favoriteRepository';
import { toast } from 'react-toastify';

const HousingPostList = () => {
    const [selectedMunicipality, setSelectedMunicipality] = useState('');
    const { housingPosts, municipalities, loading, error } = useHousingPosts(selectedMunicipality);
    const { isAuthenticated } = useContext(authContext);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (isAuthenticated) {
                try {
                    const response = await favoriteRepository.getMyFavorites();
                    setFavorites(response.data || []);
                } catch (err) {
                    console.error('Error fetching favorites:', err);
                }
            }
        };
        
        fetchFavorites();
    }, [isAuthenticated]);

    const handleMunicipalityChange = (e) => {
        setSelectedMunicipality(e.target.value);
    };
    
    const isPostFavorite = (postId) => {
        return Array.isArray(favorites) && favorites.some(fav => 
            fav.postId === postId || fav.postId === Number(postId)
        );
    };

    const toggleFavorite = async (postId) => {
        if (!isAuthenticated) {
            toast.error('Мора да бидете најавени за да додадете во омилени');
            return;
        }
        
        const isFavorite = isPostFavorite(postId);

        try {
            if (isFavorite) {
                const existingFav = favorites.find(f =>
                    f.postId === postId || f.postId === Number(postId)
                );
                
                if (existingFav) {
                    await favoriteRepository.removeFavorite(existingFav.id);
                    setFavorites(favorites.filter(f => f.id !== existingFav.id));
                    toast.success('Отстрането од омилени');
                }
            } else {
                const response = await favoriteRepository.addFavorite(postId);
                setFavorites([...favorites, response.data]);
                toast.success('Додадено во омилени');
            }
        } catch (err) {
            toast.error('Грешка при додавање/отстранување од омилени');
            console.error('Error toggling favorite:', err);
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
                                {post.images && post.images.length > 0 && (
                                    <img 
                                        src={post.images[0]} 
                                        className="card-img-top" 
                                        alt={post.title}
                                        style={{ height: '180px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://placehold.co/600x400?text=No+Image";
                                        }}
                                    />
                                )}
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text"><strong>Локација:</strong> <span>{post.location}</span></p>
                                    <p className="card-text"><strong>Општина:</strong> <span>{post.municipality}</span></p>
                                    <p className="card-text"><strong>Цена:</strong> <span>{post.price} ден.</span></p>
                                    <p className="card-text"><strong>Опис:</strong> <span>{post.description?.length > 100 
                                      ? `${post.description.substring(0, 100)}...` 
                                      : post.description}</span></p>

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

                                    {isAuthenticated && (
                                        <button
                                            className={`btn w-100 mt-2 ${isPostFavorite(post.id) ? 'btn-danger' : 'btn-outline-danger'}`}
                                            onClick={() => toggleFavorite(post.id)}
                                        >
                                            ♥ {isPostFavorite(post.id) ? 'Отстрани од омилени' : 'Додај во омилени'}
                                        </button>
                                    )}
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