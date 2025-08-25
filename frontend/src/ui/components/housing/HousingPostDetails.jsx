import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import housingPostRepository from '../../../repository/housingPostRepository.js';
import authContext from '../../../contexts/authContext.js';

const HousingPostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(authContext);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await housingPostRepository.findById(id);
                setPost(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

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
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="container my-5">
                <div className="alert alert-danger" role="alert">
                    Сместувањето не е пронајдено или има грешка при вчитување.
                </div>
            </div>
        );
    }

    return (
        <section className="container my-5">
            <h2 className="mb-4 text-center fw-bold">{post.title}</h2>

            <div className="card" style={{
                maxWidth: '700px',
                margin: '0 auto',
                boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                backgroundColor: '#fff'
            }}>
                {/* Multiple images */}
                {post.images && post.images.length > 0 && (
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        marginBottom: '1rem',
                        overflowX: 'auto',
                        paddingLeft: '1rem',
                        paddingTop: '1rem'
                    }}>
                        {post.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt="Слика"
                                style={{
                                    maxHeight: '180px',
                                    objectFit: 'cover',
                                    borderRadius: '0.3rem'
                                }}
                            />
                        ))}
                    </div>
                )}

                <div className="card-body px-4 py-3">
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Локација:</strong> <span>{post.location}</span>
                    </p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Општина:</strong> <span>{post.municipality}</span>
                    </p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Цена:</strong> <span>{post.price} ден.</span>
                    </p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Опис:</strong> <span>{post.description}</span>
                    </p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Статус:</strong>
                        <span>{post.found ? ' Веќе најдено' : ' Слободно'}</span>
                    </p>

                    <div className="mb-3">
                        <strong>Објавил:</strong>
                        <span className="ms-2">{post.owner?.username}</span>
                        <span className="ms-2 text-muted">
                            {new Date(post.createdAt).toLocaleDateString('mk-MK')}
                        </span>
                    </div>

                    <div className="d-flex justify-content-center gap-3 mt-4" style={{ minWidth: '100px' }}>
                        <Link
                            to={`/chat/${post.owner?.username}`}
                            className="btn btn-warning"
                        >
                            Прати порака
                        </Link>

                        {user && user.username === post.owner?.username && (
                            <>
                                <Link
                                    to={`/housing-posts/edit/${post.id}`}
                                    className="btn btn-primary"
                                >
                                    Уреди
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="btn btn-danger"
                                >
                                    Избриши
                                </button>
                            </>
                        )}

                        <Link to="/housing-posts" className="btn btn-secondary">
                            Назад
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HousingPostDetails;