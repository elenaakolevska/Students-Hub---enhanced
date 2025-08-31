import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import transportPostRepository from '../../../repository/transportPostRepository.js';
import favoriteRepository from '../../../repository/favoriteRepository.js';
import authContext from '../../../contexts/authContext.js';
import { toast } from 'react-toastify';

const TransportPostList = () => {
    const { user } = useContext(authContext);
    const [locationFrom, setLocationFrom] = useState('');
    const [locationTo, setLocationTo] = useState('');
    const [transportPosts, setTransportPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await transportPostRepository.findByLocation(locationFrom, locationTo);
                setTransportPosts(response.data);
            } catch (err) {
                setError('Грешка при вчитување на понудите за превоз');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [locationFrom, locationTo]);

    const handleLocationFromChange = (e) => {
        setLocationFrom(e.target.value);
    };

    const handleLocationToChange = (e) => {
        setLocationTo(e.target.value);
    };

    const addToFavorites = async (postId) => {
        if (!user) {
            toast.error('Ве молиме најавете се за да додавате во омилени');
            return;
        }
        
        try {
            await favoriteRepository.addFavorite(user.sub, postId);
            toast.success('Успешно додадено во омилени!');
        } catch (error) {
            console.error('Error adding to favorites:', error);
            toast.error('Грешка при додавање во омилени');
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
                    Превоз
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
                    Прелистај понуди за превоз и најди превоз до твојата дестинација
                </p>
            </div>

            <div className="mb-4 text-end">
                <Link to="/transport-posts/create" className="btn btn-primary">
                    + Додади нова понуда за превоз
                </Link>
            </div>

            <form className="row g-3 align-items-center mb-4">
                <div className="col-auto">
                    <label htmlFor="locationFrom" className="col-form-label">Од локација:</label>
                </div>
                <div className="col-auto">
                    <input
                        type="text"
                        id="locationFrom"
                        name="locationFrom"
                        className="form-control"
                        placeholder="Пр. Скопје"
                        value={locationFrom}
                        onChange={handleLocationFromChange}
                    />
                </div>

                <div className="col-auto">
                    <label htmlFor="locationTo" className="col-form-label">До локација:</label>
                </div>
                <div className="col-auto">
                    <input
                        type="text"
                        id="locationTo"
                        name="locationTo"
                        className="form-control"
                        placeholder="Пр. Охрид"
                        value={locationTo}
                        onChange={handleLocationToChange}
                    />
                </div>
            </form>

            {transportPosts.length === 0 ? (
                <div className="alert alert-info text-center">
                    Нема пронајдени понуди за превоз.
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {transportPosts.map(post => (
                        <div key={post.id} className="col">
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text"><strong>Од:</strong> <span>{post.locationFrom}</span></p>
                                    <p className="card-text"><strong>До:</strong> <span>{post.locationTo}</span></p>
                                    <p className="card-text"><strong>Датум:</strong> <span>{new Date(post.departureDate).toLocaleDateString('mk-MK')}</span></p>
                                    <p className="card-text"><strong>Време:</strong> <span>{post.departureTime}</span></p>
                                    <p className="card-text"><strong>Цена:</strong> <span>{post.price} ден.</span></p>
                                    <p className="card-text"><strong>Опис:</strong> <span>{post.description}</span></p>

                                    {post.tags && post.tags.length > 0 && (
                                        <div className="mb-2">
                                            {post.tags.map((tag, index) => (
                                                <span key={index} className="badge bg-secondary me-1">{tag}</span>
                                            ))}
                                        </div>
                                    )}

                                    <Link
                                        to={`/transport-posts/${post.id}`}
                                        className="btn btn-info mt-auto text-white"
                                    >
                                        Види детали
                                    </Link>

                                    <button
                                        onClick={() => addToFavorites(post.id)}
                                        className="btn btn-outline-danger w-100 mt-2"
                                    >
                                        ♥ Додај во омилени
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

export default TransportPostList;
