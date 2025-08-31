import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import housingPostRepository from '../../../repository/housingPostRepository.js';
import authContext from '../../../contexts/authContext.js';
import favoriteRepository from '../../../repository/favoriteRepository';
import { toast } from 'react-toastify';

const HousingPostDetails = () => {
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
                const response = await housingPostRepository.findById(id);
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
        if (window.confirm('Дали сте сигурни дека сакате да го избришете сместувањето?')) {
            try {
                await housingPostRepository.delete(id);
                navigate('/housing-posts');
            } catch (err) {
                console.error('Error deleting housing post:', err);
            }
        }
    };

    if (loading) {
        return (
            <div className="container my-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Вчитување детали за сместување...</span>
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
                <Link to="/housing-posts" className="btn btn-primary">
                    Назад
                </Link>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container my-5">
                <div className="alert alert-warning" role="alert">
                    Објавата за сместување не е пронајдена.
                </div>
                <Link to="/housing-posts" className="btn btn-primary">
                    Назад
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
                                    <h5 className="text-muted">Детали за сместување</h5>
                                    <p className="mb-2">
                                        <strong>Локација:</strong> <span>{post.location}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Општина:</strong> <span>{post.municipality}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Цена:</strong> <span>{post.price} ден.</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Статус:</strong>
                                        <span className={`ms-2 badge ${post.found ? 'bg-success' : 'bg-warning'}`}>
                                            {post.found ? 'Пронајдено' : 'Достапно'}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5 className="text-muted">Опис</h5>
                                <p className="lead">{post.description}</p>
                            </div>

                            {post.tags && post.tags.length > 0 && (
                                <div className="mb-4">
                                    <h5 className="text-muted">Тагови</h5>
                                    <div className="d-flex flex-wrap gap-2">
                                        {post.tags.map((tag, index) => (
                                            <span key={index} className="badge bg-secondary fs-6">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                    to="/housing-posts"
                                    className="btn btn-outline-primary"
                                >
                                    ← Назад кон листа
                                </Link>
                                <div>
                                    {user && user.id === post.userId && (
                                        <>
                                            <Link
                                                to={`/housing-posts/edit/${post.id}`}
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
                                        onClick={async () => {
                                            if (!user || !user.sub) {
                                                toast.error('Мора да бидете најавени за да додадете во омилени');
                                                return;
                                            }
                                            
                                            try {
                                                if (isFavorite) {
                                                    // Find favorite ID and remove from favorites
                                                    const favoritesResponse = await favoriteRepository.getMyFavorites(user.sub);
                                                    const favorites = favoritesResponse.data || [];
                                                    const existingFav = favorites.find(f => 
                                                        f.postId === post.id || f.postId === Number(post.id)
                                                    );
                                                    
                                                    if (existingFav) {
                                                        await favoriteRepository.removeFavorite(user.sub, existingFav.id);
                                                        setIsFavorite(false);
                                                        toast.success('Отстрането од омилени');
                                                    }
                                                } else {
                                                    // Add to favorites
                                                    await favoriteRepository.addFavorite(user.sub, post.id);
                                                    setIsFavorite(true);
                                                    toast.success('Додадено во омилени');
                                                }
                                            } catch (err) {
                                                console.error('Error toggling favorite status:', err);
                                                toast.error('Грешка при додавање/отстранување од омилени');
                                            }
                                        }}
                                    >
                                        ♥ {isFavorite ? 'Отстрани од омилени' : 'Додај во омилени'}
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

export default HousingPostDetails;