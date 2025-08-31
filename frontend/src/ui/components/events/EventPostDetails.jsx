import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import authContext from '../../../contexts/authContext.js';
import eventPostRepository from "../../../repository/eventPostRepository";
import favoriteRepository from '../../../repository/favoriteRepository';
import { toast } from 'react-toastify';

const EventPostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(authContext);
    const [eventPost, setEventPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchEventPost = async () => {
            try {
                const response = await eventPostRepository.findById(id);
                setEventPost(response.data);
                
                // Check if this post is in user's favorites
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
        if (window.confirm('Дали сте сигурни дека сакате да го избришете настанот?')) {
            try {
                await eventPostRepository.delete(id);
                navigate('/event-posts');
            } catch (err) {
                console.error('Error deleting event post:', err);
            }
        }
    };

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
                <Link to="/event-posts" className="btn btn-primary">
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
                <Link to="/event-posts" className="btn btn-primary">
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
                                        <strong>Датум:</strong> <span>{eventPost.createdAt ? new Date(eventPost.createdAt).toLocaleDateString('mk-MK') : 'Непознато'}</span>
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
                            </div>

                            <div className="mb-4">
                                <h5 className="text-muted">Опис</h5>
                                <p className="lead">{eventPost.description}</p>
                            </div>

                            {eventPost.tags && eventPost.tags.length > 0 && (
                                <div className="mb-4">
                                    <h5 className="text-muted">Тагови</h5>
                                    <div className="d-flex flex-wrap gap-2">
                                        {eventPost.tags.map((tag, index) => (
                                            <span key={index} className="badge bg-secondary fs-6">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <h5 className="text-muted">Информации за постот</h5>
                                {eventPost.createdAt && (
                                    <p className="mb-1">
                                        <strong>Создадено:</strong> {new Date(eventPost.createdAt).toLocaleDateString('mk-MK')}
                                    </p>
                                )}
                                {eventPost.updatedAt && eventPost.updatedAt !== eventPost.createdAt && (
                                    <p className="mb-1">
                                        <strong>Последно ажурирано:</strong> {new Date(eventPost.updatedAt).toLocaleDateString('mk-MK')}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="card-footer bg-light">
                            <div className="d-flex justify-content-between">
                                <Link
                                    to="/event-posts"
                                    className="btn btn-outline-primary"
                                >
                                    ← Назад кон листа
                                </Link>
                                <div>
                                    {user && (
                                        <>
                                            <Link
                                                to={`/event-posts/edit/${eventPost.id}`}
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
                                                    const existingFav = favorites.find(f => f.postId === eventPost.id || f.postId === Number(eventPost.id));
                                                    
                                                    if (existingFav) {
                                                        await favoriteRepository.removeFavorite(user.sub, existingFav.id);
                                                        setIsFavorite(false);
                                                        toast.success('Отстрането од омилени');
                                                    }
                                                } else {
                                                    // Add to favorites
                                                    await favoriteRepository.addFavorite(user.sub, eventPost.id);
                                                    setIsFavorite(true);
                                                    toast.success('Додадено во омилени');
                                                }
                                            } catch (err) {
                                                console.error('Error toggling favorite status:', err);
                                                toast.error('Грешка при додавање/отстранување од омилени');
                                            }
                                        }}
                                    >
                                        {isFavorite ? '♥ Отстрани од омилени' : '♥ Додај во омилени'}
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

export default EventPostDetails;