import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import tutorPostRepository from '../../../repository/tutorPostRepository';
import favoriteRepository from '../../../repository/favoriteRepository';
import authContext from '../../../contexts/authContext';
import { toast } from 'react-toastify';

const TutorPostDetails = () => {
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
                setLoading(true);
                const response = await tutorPostRepository.findById(id);
                const postData = response.data;
                setPost(postData);
                setError(null);
                
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
                setError(err.response?.data?.message || err.message);
                console.error("Error fetching tutor post:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id, user]);
    
    const handleDelete = async () => {
        if (window.confirm('Дали сте сигурни дека сакате да го избришете тутор огласот?')) {
            try {
                await tutorPostRepository.delete(id);
                navigate('/tutor-posts');
            } catch (err) {
                console.error('Error deleting tutor post:', err);
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

    if (loading) {
        return (
            <div className="container my-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Вчитување детали за тутор пост...</span>
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
                <Link to="/tutor-posts" className="btn btn-primary">
                    Назад кон листа
                </Link>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container my-5">
                <div className="alert alert-warning" role="alert">
                    Тутор постот не е пронајден.
                </div>
                <Link to="/tutor-posts" className="btn btn-primary">
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
                                    <h5 className="text-muted">Информации за тутор</h5>
                                    <p className="mb-2">
                                        <strong>Тутор:</strong> <span className="text-primary">{post.tutorName}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Предмет:</strong> <span>{post.subject}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Оцена:</strong>
                                        <span className="ms-2">
                                            {post.rating}/5
                                            <span className="text-warning ms-1">
                                                {'⭐'.repeat(parseInt(post.rating))}
                                            </span>
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
                                    to="/tutor-posts"
                                    className="btn btn-outline-primary"
                                >
                                    ← Назад кон листа
                                </Link>
                                <div>
                                    {user && (
                                        <>
                                            <Link
                                                to={`/tutor-posts/edit/${post.id}`}
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

export default TutorPostDetails;
