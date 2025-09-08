import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import authContext from '../../contexts/authContext';
import favoriteRepository from '../../repository/favoriteRepository';
import { toast } from 'react-toastify';

const Favorites = () => {
    const { user, isAuthenticated } = useContext(authContext);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchFavorites = useCallback(async () => {
        try {
            setLoading(true);
            if (!user) {
                console.warn('User is not authenticated, skipping favorites fetch');
                setLoading(false);
                return;
            }
            const response = await favoriteRepository.getMyFavorites();
            console.log('Favorites response:', response);
            if (response.data && response.data.length > 0) {
                console.log('First favorite item structure:', JSON.stringify(response.data[0], null, 2));
            }
            setFavorites(response.data || []);
        } catch (err) {
            console.error('Error fetching favorites:', err);
            setError('Грешка при вчитување на омилените');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchFavorites();
        }
    }, [isAuthenticated, fetchFavorites]);

    const removeFavorite = async (favoriteId) => {
        try {
            await favoriteRepository.removeFavorite(favoriteId);
            setFavorites(favorites.filter(fav => fav.id !== favoriteId));
            toast.success('Отстрането од омилени');
        } catch (err) {
            console.error('Error removing favorite:', err);
            toast.error('Грешка при отстранување од омилени');
        }
    };

    const getPostTypeRoute = (postType) => {
        const typeRoutes = {
            'EVENT': 'event-posts',
            'HOUSING': 'housing-posts',
            'INTERNSHIP': 'internship-posts',
            'MATERIAL': 'material-posts',
            'TRANSPORT': 'transport-posts',
            'TUTOR': 'tutor-posts'
        };
        return typeRoutes[postType] || 'posts';
    };

    const getPostTypeLabel = (postType) => {
        const typeLabels = {
            'EVENT': 'Настан',
            'HOUSING': 'Домување',
            'INTERNSHIP': 'Пракса',
            'MATERIAL': 'Материјал',
            'TRANSPORT': 'Превоз',
            'TUTOR': 'Тутор'
        };
        return typeLabels[postType] || postType;
    };

    if (!isAuthenticated) {
        return (
            <div className="container my-5">
                <div className="alert alert-warning text-center">
                    Мора да бидете најавени за да ги видите омилените.
                </div>
            </div>
        );
    }

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
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Мои омилени</h2>
                        <small className="text-muted">
                            {favorites.length} {favorites.length === 1 ? 'омилена објава' : 'омилени објави'}
                        </small>
                    </div>

                    {favorites.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="mb-4">
                                <i className="fas fa-heart fa-3x text-muted"></i>
                            </div>
                            <h4 className="text-muted">Немате омилени објави</h4>
                            <p className="text-muted">
                                Започнете да додавате објави во омилени за полесно пронаоѓање подоцна.
                            </p>
                            <Link to="/" className="btn btn-primary">
                                Разгледај објави
                            </Link>
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {favorites.map(favorite => (
                                <div key={favorite.id} className="col">
                                    <div className="card h-100">
                                        <div className="card-body d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <span className="badge bg-primary">
                                                    {favorite.postType ? getPostTypeLabel(favorite.postType) : 'Unknown'}
                                                </span>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => removeFavorite(favorite.id)}
                                                    title="Отстрани од омилени"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>

                                            <h5 className="card-title">{favorite.postTitle}</h5>

                                            {favorite.postDescription && (
                                                <p className="card-text">
                                                    {favorite.postDescription.length > 100
                                                        ? `${favorite.postDescription.substring(0, 100)}...`
                                                        : favorite.postDescription}
                                                </p>
                                            )}

                                            <div className="mt-auto">
                                                <Link
                                                    to={`/${getPostTypeRoute(favorite.postType)}/${favorite.postId}`}
                                                    className="btn btn-outline-primary w-100"
                                                >
                                                    Види детали
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="card-footer text-muted small">
                                            Додадено на: {new Date(favorite.createdAt).toLocaleDateString('mk-MK')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Favorites;
