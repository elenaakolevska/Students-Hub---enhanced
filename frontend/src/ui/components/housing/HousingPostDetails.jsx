import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import housingPostRepository from '../../../repository/housingPostRepository.js';
import authContext from '../../../contexts/authContext.js';
import favoriteRepository from '../../../repository/favoriteRepository';
import { toast } from 'react-toastify';

const HousingPostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useContext(authContext);
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
        if (!isAuthenticated) {
            toast.error('Мора да бидете најавени');
            navigate('/login');
            return;
        }

        if (window.confirm('Дали сте сигурни дека сакате да го избришете сместувањето?')) {
            try {
                await housingPostRepository.delete(id);
                navigate('/housing-posts');
            } catch (err) {
                if (err.response?.status === 401) {
                    toast.error('Мора да бидете најавени');
                    navigate('/login');
                } else if (err.response?.status === 403) {
                    toast.error('Немате дозвола за ова дејство');
                } else {
                    toast.error('Грешка при бришење на сместувањето');
                }
            }
        }
    };

    const handleChatWithCreator = async () => {
        if (!isAuthenticated) {
            toast.error('Мора да бидете најавени за да започнете разговор');
            return;
        }

        if (user.username === post.ownerUsername) {
            toast.info('Не можете да разговарате со себе');
            return;
        }

        try {
            navigate(`/chat/${post.ownerUsername}`);
        } catch (err) {
            toast.error('Грешка при започнување на разговор');
        }
    };

    const toggleFavorite = async () => {
        if (!isAuthenticated) {
            toast.error('Мора да бидете најавени за да додадете во омилени');
            navigate('/login');
            return;
        }

        try {
            if (isFavorite) {
                const favoritesResponse = await favoriteRepository.getMyFavorites(user.id);
                const favorites = favoritesResponse.data || [];
                const favorite = favorites.find(fav => fav.postId === id || fav.postId === Number(id));

                if (favorite) {
                    await favoriteRepository.removeFavorite(user.id, favorite.id);
                    setIsFavorite(false);
                    toast.success('Отстрането од омилени');
                }
            } else {
                await favoriteRepository.addFavorite(user.id, id);
                setIsFavorite(true);
                toast.success('Додадено во омилени');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                toast.error('Мора да бидете најавени');
                navigate('/login');
            } else {
                toast.error('Грешка при ажурирање на омилени');
            }
        }
    };

    const isOwner = isAuthenticated && user && post && user.username === post.ownerUsername;

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
                <Link to="/housing" className="btn btn-primary">
                    Назад кон листа
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
                <Link to="/housing" className="btn btn-primary">
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
                        {post.images && post.images.length > 0 && (
                            <div className="image-gallery">
                                <img 
                                    src={post.images[0]} 
                                    className="card-img-top" 
                                    alt={post.title}
                                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://placehold.co/600x400?text=No+Image";
                                    }}
                                />
                                {post.images.length > 1 && (
                                    <div className="d-flex overflow-auto py-2" style={{ scrollSnapType: 'x mandatory' }}>
                                        {post.images.map((img, index) => (
                                            <img 
                                                key={index}
                                                src={img} 
                                                alt={`${post.title} ${index+1}`}
                                                className="me-2"
                                                style={{ 
                                                    height: '80px', 
                                                    minWidth: '120px',
                                                    objectFit: 'cover', 
                                                    cursor: 'pointer',
                                                    scrollSnapAlign: 'start',
                                                    border: '2px solid #eee',
                                                    borderRadius: '4px'
                                                }}
                                                onClick={(e) => {
                                                    document.querySelector('.card-img-top').src = e.target.src;
                                                }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://placehold.co/120x80?text=Error";
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="card-body">
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h5 className="text-muted">Детали за сместување</h5>
                                    <p className="mb-2">
                                        <strong>Локација:</strong> <span>{post.location}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Цена:</strong> <span>{post.price} ден.</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Тип:</strong> <span>{post.housingType}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Достапно од:</strong> <span>{new Date(post.availableFrom).toLocaleDateString('mk-MK')}</span>
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <h5 className="text-muted">Информации за авторот</h5>
                                    <p className="mb-2">
                                        <strong>Создал:</strong> <span>{post.ownerUsername}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Создадено:</strong> <span>{new Date(post.createdAt).toLocaleDateString('mk-MK', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</span>
                                    </p>
                                    {isAuthenticated && user && user.username !== post.ownerUsername && (
                                        <button
                                            onClick={handleChatWithCreator}
                                            className="btn btn-success btn-sm"
                                        >
                                            💬 Разговарај со {post.ownerUsername}
                                        </button>
                                    )}
                                    {!isAuthenticated && (
                                        <div className="mt-2">
                                            <Link to="/login" className="btn btn-outline-primary btn-sm">
                                                Најавете се за разговор
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5 className="text-muted">Опис</h5>
                                <p className="lead">{post.description}</p>
                            </div>

                            {post.tags && post.tags.length > 0 && (
                                <div className="mb-4">
                                    <h5 className="text-muted">Тагови</h5>
                                    <div>
                                        {post.tags.map((tag, index) => (
                                            <span key={index} className="badge bg-secondary me-2">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {post.updatedAt && post.updatedAt !== post.createdAt && (
                                <div className="mb-4">
                                    <p className="text-muted small">
                                        <strong>Последно ажурирано:</strong> {new Date(post.updatedAt).toLocaleDateString('mk-MK', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="card-footer bg-light">
                            <div className="d-flex justify-content-between">
                                <Link
                                    to="/housing"
                                    className="btn btn-outline-primary"
                                >
                                    ← Назад кон листа
                                </Link>
                                <div>
                                    {isOwner && (
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
                                    {isAuthenticated ? (
                                        <button
                                            className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
                                            onClick={toggleFavorite}
                                        >
                                            {isFavorite
                                                ? <><i className="bi bi-heart-fill"></i> Отстрани од омилени</>
                                                : <><i className="bi bi-heart"></i> Додај во омилени</>
                                            }
                                        </button>
                                    ) : (
                                        <Link to="/login" className="btn btn-outline-primary">
                                            Најавете се за омилени
                                        </Link>
                                    )}
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

