import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import authContext from '../../../contexts/authContext.js';
import eventPostRepository from "../../../repository/eventPostRepository";
import favoriteRepository from '../../../repository/favoriteRepository';
import { toast } from 'react-toastify';

const EventPostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useContext(authContext);
    const [eventPost, setEventPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchEventPost = async () => {
            try {
                const response = await eventPostRepository.findById(id);
                setEventPost(response.data);
                
                if (user && user.sub) {
                    try {
                        const favoritesResponse = await favoriteRepository.getMyFavorites(user.sub);
                        const favorites = favoritesResponse.data || [];
                        setIsFavorite(favorites.some(fav => fav.postId === id || fav.postId === Number(id)));
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

        fetchEventPost();
    }, [id, user]);

    const handleDelete = async () => {
        if (!isAuthenticated) {
            toast.error('Мора да бидете најавени');
            navigate('/login');
            return;
        }

        if (window.confirm('Дали сте сигурни дека сакате да го избришете настанот?')) {
            try {
                await eventPostRepository.delete(id);
                navigate('/event-posts');
            } catch (err) {
                if (err.response?.status === 401) {
                    toast.error('Мора да бидете најавени');
                    navigate('/login');
                } else if (err.response?.status === 403) {
                    toast.error('Немате дозвола за ова дејство');
                } else {
                    toast.error('Грешка при бришење на настанот');
                }
            }
        }
    };

    const handleChatWithCreator = async () => {
        if (!isAuthenticated) {
            toast.error('Мора да бидете најавени за да започнете разговор');
            return;
        }

        if (user.username === eventPost.ownerUsername) {
            toast.info('Не можете да разговарате со себе');
            return;
        }

        try {
            navigate(`/chat/${eventPost.ownerUsername}`);
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

    const isOwner = isAuthenticated && user && eventPost && user.username === eventPost.ownerUsername;

    if (loading) {
        return (
            <div className="container my-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Вчитување детали за настан...</span>
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
                <Link to="/events" className="btn btn-primary">
                    Назад кон листа
                </Link>
            </div>
        );
    }

    if (!eventPost) {
        return (
            <div className="container my-5">
                <div className="alert alert-warning" role="alert">
                    Настанот не е пронајден.
                </div>
                <Link to="/events" className="btn btn-primary">
                    Назад кон листа
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '3rem', marginBottom: '5rem' }}>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h1 className="card-title mb-0">{eventPost.title}</h1>
                        </div>
                        {eventPost.imageUrl && (
                            <img 
                                src={eventPost.imageUrl} 
                                className="card-img-top" 
                                alt={eventPost.title}
                                style={{ maxHeight: '400px', objectFit: 'cover' }}
                            />
                        )}
                        <div className="card-body">
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h5 className="text-muted">Детали за настан</h5>
                                    <p className="mb-2">
                                        <strong>Категорија:</strong> <span>{eventPost.eventCategory}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Локација:</strong> <span>{eventPost.location}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Организатор:</strong> <span>{eventPost.organizer}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Цена:</strong>
                                        <span className="ms-2">
                                            {eventPost.isFree ? 'Бесплатно' : `${eventPost.price} ден.`}
                                        </span>
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <h5 className="text-muted">Информации за авторот</h5>
                                    <p className="mb-2">
                                        <strong>Создал:</strong> <span>{eventPost.ownerUsername}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Создадено:</strong> <span>{new Date(eventPost.createdAt).toLocaleDateString('mk-MK', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</span>
                                    </p>
                                    {isAuthenticated && user && user.username !== eventPost.ownerUsername && (
                                        <button
                                            onClick={handleChatWithCreator}
                                            className="btn btn-success btn-sm"
                                        >
                                            💬 Разговарај со {eventPost.ownerUsername}
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
                                <p className="lead">{eventPost.description}</p>
                            </div>

                            {eventPost.tags && eventPost.tags.length > 0 && (
                                <div className="mb-4">
                                    <h5 className="text-muted">Тагови</h5>
                                    <div>
                                        {eventPost.tags.map((tag, index) => (
                                            <span key={index} className="badge bg-secondary me-2">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {eventPost.updatedAt && eventPost.updatedAt !== eventPost.createdAt && (
                                <div className="mb-4">
                                    <p className="text-muted small">
                                        <strong>Последно ажурирано:</strong> {new Date(eventPost.updatedAt).toLocaleDateString('mk-MK', {
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
                                    to="/events"
                                    className="btn btn-outline-primary"
                                >
                                    ← Назад кон листа
                                </Link>
                                <div>
                                    {isOwner && (
                                        <>
                                            <Link
                                                to={`/event-posts/${eventPost.id}/edit`}
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
                                    {isAuthenticated && (
                                        <button
                                            className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
                                            onClick={toggleFavorite}
                                        >
                                            {isFavorite
                                                ? <><i className="bi bi-heart-fill"></i> Отстрани од омилени</>
                                                : <><i className="bi bi-heart"></i> Додај во омилени</>
                                            }
                                        </button>
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

export default EventPostDetails;