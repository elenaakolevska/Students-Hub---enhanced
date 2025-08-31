import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import useInternshipPosts from '../../../hooks/useInternshipPosts.js';
import authContext from '../../../contexts/authContext';
import favoriteRepository from '../../../repository/favoriteRepository';
import { toast } from 'react-toastify';

const InternshipPostList = () => {
    const [facultyFilter, setFacultyFilter] = useState('');
    const { internshipPosts, loading, error } = useInternshipPosts(facultyFilter);
    const { user } = useContext(authContext);
    const [favorites, setFavorites] = useState([]);

    // Load user's favorites when component mounts or user changes
    useEffect(() => {
        const fetchFavorites = async () => {
            if (user && user.sub) {
                try {
                    const response = await favoriteRepository.getMyFavorites(user.sub);
                    setFavorites(response.data || []);
                } catch (err) {
                    console.error('Error fetching favorites:', err);
                }
            }
        };
        
        fetchFavorites();
    }, [user]);
    
    const handleFacultyChange = (e) => {
        setFacultyFilter(e.target.value);
    };

    const isPostFavorite = (postId) => {
        return Array.isArray(favorites) && favorites.some(fav => 
            fav.postId === postId || fav.postId === Number(postId)
        );
    };

    const toggleFavorite = async (postId) => {
        if (!user || !user.sub) {
            toast.error('Мора да бидете најавени за да додадете во омилени');
            return;
        }
        
        const isFavorite = isPostFavorite(postId);
        const username = user.sub;
        
        try {
            if (isFavorite) {
                // Find and remove from favorites
                const existingFav = favorites.find(f => 
                    f.postId === postId || f.postId === Number(postId)
                );
                
                if (existingFav) {
                    await favoriteRepository.removeFavorite(username, existingFav.id);
                    setFavorites(favorites.filter(f => f.id !== existingFav.id));
                    toast.success('Отстрането од омилени');
                }
            } else {
                // Add to favorites
                const response = await favoriteRepository.addFavorite(username, postId);
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
                    Пракси
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
                    Изгради се на професионално ниво и стекни ново искуство
                </p>
            </div>

            <div className="mb-4 text-end">
                <Link to="/internship-posts/create" className="btn btn-primary">
                    + Додади нова пракса
                </Link>
            </div>

            <form className="row g-3 align-items-center mb-4">
                <div className="col-auto">
                    <label htmlFor="facultyFilter" className="col-form-label">Филтер по факултет:</label>
                </div>
                <div className="col-auto">
                    <input
                        type="text"
                        id="facultyFilter"
                        name="facultyFilter"
                        className="form-control"
                        placeholder="Пр. ФИНКИ, Економски"
                        value={facultyFilter}
                        onChange={handleFacultyChange}
                    />
                </div>
            </form>

            {internshipPosts.length === 0 ? (
                <div className="alert alert-info text-center">
                    Нема пронајдени пракси.
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {internshipPosts.map(post => (
                        <div key={post.id} className="col">
                            <div className="card h-100">
                                {post.logoUrl && (
                                    <img 
                                        src={post.logoUrl} 
                                        className="card-img-top" 
                                        alt={`${post.company} logo`}
                                        style={{ height: '180px', objectFit: 'contain', padding: '15px', backgroundColor: '#f8f9fa' }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://placehold.co/600x400?text=No+Logo";
                                        }}
                                    />
                                )}
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text"><strong>Компанија:</strong> <span>{post.company}</span></p>
                                    <p className="card-text"><strong>Факултет:</strong> <span>{post.facultyFilter}</span></p>
                                    <p className="card-text"><strong>Позиција:</strong> <span>{post.position}</span></p>
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
                                        to={`/internship-posts/${post.id}`}
                                        className="btn btn-info mt-auto text-white"
                                    >
                                        Види детали
                                    </Link>

                                    <button
                                        onClick={() => toggleFavorite(post.id)}
                                        className={`btn w-100 mt-2 ${isPostFavorite(post.id) ? 'btn-danger' : 'btn-outline-danger'}`}
                                    >
                                        ♥ {isPostFavorite(post.id) ? 'Отстрани од омилени' : 'Додај во омилени'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InternshipPostList;