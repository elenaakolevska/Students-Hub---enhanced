import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useMaterialPosts from '../../../hooks/useMaterialPosts.js';
import materialPostRepository from '../../../repository/materialPostRepository.js';
import authContext from '../../../contexts/authContext';
import favoriteRepository from '../../../repository/favoriteRepository';
import { toast } from 'react-toastify';

const MaterialPostList = () => {
    const [selectedSubject, setSelectedSubject] = useState('');
    const { materialPosts, subjects, loading, error } = useMaterialPosts(selectedSubject);
    const { isAuthenticated } = useContext(authContext);
    const navigate = useNavigate();
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

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
    };
    
    const isPostFavorite = (postId) => {
        return Array.isArray(favorites) && favorites.some(fav => 
            fav.postId === postId || fav.postId === Number(postId)
        );
    };

    const toggleFavorite = async (postId) => {
        if (!isAuthenticated) {
            toast.error('Мора да бидете најавени за да додадете во омилени');
            navigate('/login');
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

    const handleDownload = async (postId) => {
        try {
            const response = await materialPostRepository.download(postId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'material');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    if (loading) {
        return (
            <div className="container my-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Вчитување материјали...</span>
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
                    Материјали
                    <div style={{
                        content: '',
                        position: 'absolute',
                        left: '50%',
                        bottom: 0,
                        transform: 'translateX(-50%)',
                        width: '60px',
                        height: '4px',
                        background: '#dc3545',
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
                    Пронајдете едукативни материјали и ресурси за вашите студии
                </p>
            </div>

            <div className="mb-4 text-end">
                <Link to="/material-posts/create" className="btn btn-primary">
                    + Додади нов материјал
                </Link>
            </div>

            <form className="row g-3 align-items-center mb-4">
                <div className="col-auto">
                    <label htmlFor="subject" className="col-form-label">Филтер по предмет:</label>
                </div>
                <div className="col-auto">
                    <select
                        name="subject"
                        id="subject"
                        className="form-select"
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                    >
                        <option value="">Сите предмети</option>
                        {subjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                        ))}
                    </select>
                </div>
            </form>

            {materialPosts.length === 0 ? (
                <div className="alert alert-info text-center">
                    Нема пронајдени материјали.
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {materialPosts.map(post => (
                        <div key={post.id} className="col">
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text"><strong>Предмет:</strong> <span>{post.subject}</span></p>
                                    <p className="card-text"><strong>Оцена:</strong> <span>{post.rating}</span></p>
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
                                        to={`/material-posts/${post.id}`}
                                        className="btn btn-info mt-auto text-white"
                                    >
                                        Види детали
                                    </Link>

                                    {post.originalFileName && (
                                        <button
                                            onClick={() => handleDownload(post.id)}
                                            className="btn btn-success w-100 mt-2"
                                        >
                                            📥 Преземи фајл
                                        </button>
                                    )}

                                    {isAuthenticated && (
                                        <button
                                            onClick={() => toggleFavorite(post.id)}
                                            className={`btn w-100 mt-2 ${isPostFavorite(post.id) ? 'btn-danger' : 'btn-outline-danger'}`}
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

export default MaterialPostList;