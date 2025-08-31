import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import materialPostRepository from '../../../repository/materialPostRepository.js';
import favoriteRepository from '../../../repository/favoriteRepository';
import authContext from '../../../contexts/authContext.js';
import { toast } from 'react-toastify';

const MaterialPostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(authContext);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await materialPostRepository.findById(id);
                setPost(response.data);
                
                // Check if this post is in user's favorites
                if (user && user.sub) {
                    try {
                        const favoritesResponse = await favoriteRepository.getMyFavorites(user.sub);
                        const favorites = favoritesResponse.data || [];
                        setIsFavorite(favorites.some(fav => 
                            fav.postId === id || fav.postId === Number(id)
                        ));
                    } catch (favError) {
                        console.error('Error checking favorites status:', favError);
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, user]);

    const handleDelete = async () => {
        if (window.confirm('Дали сте сигурни дека сакате да го избришете материјалот?')) {
            try {
                await materialPostRepository.delete(id);
                navigate('/material-posts');
            } catch (err) {
                console.error('Error deleting material post:', err);
            }
        }
    };
    
    const toggleFavorite = async () => {
        if (!user || !user.sub) {
            toast.error('Мора да бидете најавени за да додадете во омилени');
            return;
        }
        
        try {
            if (isFavorite) {
                // Find the favorite ID
                const favoritesResponse = await favoriteRepository.getMyFavorites(user.sub);
                const favorites = favoritesResponse.data || [];
                const favorite = favorites.find(fav => 
                    fav.postId === id || fav.postId === Number(id)
                );
                
                if (favorite) {
                    await favoriteRepository.removeFavorite(user.sub, favorite.id);
                    setIsFavorite(false);
                    toast.success('Отстрането од омилени');
                }
            } else {
                // Add to favorites
                await favoriteRepository.addFavorite(user.sub, id);
                setIsFavorite(true);
                toast.success('Додадено во омилени');
            }
        } catch (err) {
            toast.error('Грешка при ажурирање на омилени');
            console.error('Error updating favorites:', err);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await materialPostRepository.download(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${post.title}`);
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
                        <span className="visually-hidden">Вчитување детали за материјал...</span>
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
                <Link to="/material-posts" className="btn btn-primary">
                    Назад кон листа
                </Link>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container my-5">
                <div className="alert alert-warning" role="alert">
                    Материјалот не е пронајден.
                </div>
                <Link to="/material-posts" className="btn btn-primary">
                    Назад кон листа
                </Link>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h1 className="card-title mb-0">{post.title}</h1>
                        </div>
                        <div className="card-body">
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h5 className="text-muted">Детали за материјал</h5>
                                    <p className="mb-2">
                                        <strong>Предмет:</strong> <span>{post.subject}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Оцена:</strong> <span>{post.rating}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Фајл:</strong>
                                        <button
                                            onClick={handleDownload}
                                            className="btn btn-outline-success btn-sm ms-2"
                                        >
                                            📥 Преземи
                                        </button>
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5 className="text-muted">Опис</h5>
                                <p className="lead">{post.description}</p>
                            </div>

                            <div className="mb-4">
                                <h5 className="text-muted">Информации за постот</h5>
                                {post.createdAt && (
                                    <p className="mb-1">
                                        <strong>Создадено:</strong> {new Date(post.createdAt).toLocaleDateString('mk-MK')}
                                    </p>
                                )}
                                {post.updatedAt && post.updatedAt !== post.createdAt && (
                                    <p className="mb-1">
                                        <strong>Последно ажурирано:</strong> {new Date(post.updatedAt).toLocaleDateString('mk-MK')}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="card-footer bg-light">
                            <div className="d-flex justify-content-between">
                                <Link
                                    to="/material-posts"
                                    className="btn btn-outline-primary"
                                >
                                    ← Назад кон листа
                                </Link>
                                <div>
                                    {user && user.id === post.userId && (
                                        <>
                                            <Link
                                                to={`/material-posts/edit/${post.id}`}
                                                className="btn btn-outline-warning me-2"
                                            >
                                                Уреди
                                            </Link>
                                            <button
                                                onClick={handleDelete}
                                                className="btn btn-outline-danger me-2"
                                            >
                                                Избриши
                                            </button>
                                        </>
                                    )}
                                    <button
                                        className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
                                        onClick={toggleFavorite}
                                    >
                                        {isFavorite 
                                            ? <><i className="bi bi-heart-fill"></i> Отстрани од омилени</>
                                            : <><i className="bi bi-heart"></i> Додај во омилени</>
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialPostDetails;