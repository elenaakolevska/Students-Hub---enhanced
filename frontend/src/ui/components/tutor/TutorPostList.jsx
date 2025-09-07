import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useTutorPosts from '../../../hooks/useTutorPosts.js';
import authContext from '../../../contexts/authContext';
import favoriteRepository from '../../../repository/favoriteRepository';
import { toast } from 'react-toastify';

const TutorPostList = () => {
    const [tutorName, setTutorName] = useState('');
    const [subject, setSubject] = useState('');
    const { tutorPosts, loading, error, refetch } = useTutorPosts(tutorName, subject);
    const { user, isAuthenticated } = useContext(authContext);
    const [favorites, setFavorites] = useState([]);

    const isPostFavorite = (postId) => {
        return favorites.some(fav => 
            String(fav.postId) === String(postId)
        );
    };

    useEffect(() => {
        if (isAuthenticated) {
            const fetchFavorites = async () => {
                try {
                    const favoritesResponse = await favoriteRepository.getMyFavorites();
                    setFavorites(favoritesResponse.data || []);
                } catch (error) {
                    console.error('Error fetching favorites:', error);
                }
            };
            fetchFavorites();
        }
    }, [isAuthenticated]);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        refetch();
    };

    const toggleFavorite = async (postId) => {
        if (!isAuthenticated) {
            toast.error('Мора да бидете најавени за да додадете во омилени');
            return;
        }
        
        try {
            if (isPostFavorite(postId)) {
                const favorite = favorites.find(f => String(f.postId) === String(postId));
                if (favorite) {
                    await favoriteRepository.removeFavorite(favorite.id);
                    setFavorites(favorites.filter(f => f.id !== favorite.id));
                    toast.success('Отстрането од омилени');
                }
            } else {
                const response = await favoriteRepository.addFavorite(postId);
                setFavorites([...favorites, response.data]);
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
                    Тутори
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
                    Најдете го идеалниот тутор за вашите потреби и факултет
                </p>
            </div>

            <div className="mb-4 text-end">
                <Link to="/tutor-posts/create" className="btn btn-primary">
                    + Додади нов тутор
                </Link>
            </div>

            <form onSubmit={handleFilterSubmit} className="row g-3 align-items-center mb-4">
                <div className="col-auto">
                    <label htmlFor="tutorName" className="col-form-label">Филтер по име на тутор:</label>
                </div>
                <div className="col-auto">
                    <input
                        type="text"
                        id="tutorName"
                        name="tutorName"
                        className="form-control"
                        placeholder="Пр. Иван Иванов"
                        value={tutorName}
                        onChange={(e) => setTutorName(e.target.value)}
                    />
                </div>

                <div className="col-auto">
                    <label htmlFor="subject" className="col-form-label">Филтер по предмет:</label>
                </div>
                <div className="col-auto">
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        className="form-control"
                        placeholder="Пр. Математика"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>

                <div className="col-auto">
                    <button type="submit" className="btn btn-outline-primary">Филтрирај</button>
                </div>
            </form>

            {tutorPosts.length === 0 ? (
                <div className="alert alert-info text-center">
                    Нема пронајдени тутор постови.
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {tutorPosts.map(post => (
                        <div key={post.id} className="col">
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text"><strong>Тутор:</strong> <span>{post.tutorName}</span></p>
                                    <p className="card-text"><strong>Предмет:</strong> <span>{post.subject}</span></p>
                                    <p className="card-text"><strong>Оцена:</strong> <span>{post.rating}/5</span></p>
                                    <p className="card-text"><strong>Опис:</strong> <span>{post.description}</span></p>

                                    {post.tags && post.tags.length > 0 && (
                                        <div className="mb-2">
                                            {post.tags.map((tag, index) => (
                                                <span key={index} className="badge bg-secondary me-1">{tag}</span>
                                            ))}
                                        </div>
                                    )}

                                    <Link
                                        to={`/tutor-posts/${post.id}`}
                                        className="btn btn-info mt-auto text-white"
                                    >
                                        Види детали
                                    </Link>

                                    {isAuthenticated && (
                                        <button
                                            onClick={() => toggleFavorite(post.id)}
                                            className={`btn ${isPostFavorite(post.id) ? 'btn-danger' : 'btn-outline-danger'} w-100 mt-2`}
                                        >
                                            {isPostFavorite(post.id)
                                                ? <><i className="bi bi-heart-fill"></i> Отстрани од омилени</>
                                                : <><i className="bi bi-heart"></i> Додај во омилени</>
                                            }
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

export default TutorPostList;
