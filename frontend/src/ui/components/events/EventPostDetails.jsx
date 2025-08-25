import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import authContext from '../../../contexts/authContext.js';
import eventPostRepository from "../../../repository/eventPostRepository";

const EventPostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(authContext);
    const [eventPost, setEventPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventPost = async () => {
            try {
                const response = await eventPostRepository.findById(id);
                setEventPost(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEventPost();
    }, [id]);

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
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !eventPost) {
        return (
            <div className="container my-5">
                <div className="alert alert-danger" role="alert">
                    Настанот не е пронајден или има грешка при вчитување.
                </div>
            </div>
        );
    }

    return (
        <section className="container my-5">
            <h2 className="mb-4 text-center fw-bold">{eventPost.title}</h2>

            <div className="card" style={{
                maxWidth: '700px',
                margin: '0 auto',
                boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                backgroundColor: '#fff'
            }}>
                <img
                    src={eventPost.imageUrl || '/images/default-event.jpg'}
                    alt="Слика од настанот"
                    style={{ height: '320px', objectFit: 'cover', width: '100%' }}
                />

                <div className="card-body px-4 py-3">
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Категорија:</strong> <span>{eventPost.eventCategory}</span>
                    </p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Локација:</strong> <span>{eventPost.location}</span>
                    </p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Влез:</strong>
                        <span>{eventPost.free ? ' Слободен' : ` Цена: ${eventPost.price} ден.`}</span>
                    </p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Опис:</strong> <span>{eventPost.description}</span>
                    </p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Организатор:</strong> <span>{eventPost.organizer}</span>
                    </p>

                    <div className="mb-3">
                        <strong>Објавил:</strong>
                        <span className="ms-2">{eventPost.owner?.username}</span>
                        <span className="ms-2 text-muted">
                            {new Date(eventPost.createdAt).toLocaleDateString('mk-MK')}
                        </span>
                    </div>

                    <div className="d-flex justify-content-center gap-3 mt-4" style={{ minWidth: '100px' }}>
                        <Link
                            to={`/chat/${eventPost.owner?.username}`}
                            className="btn btn-warning"
                        >
                            Прати порака
                        </Link>

                        {user && user.username === eventPost.owner?.username && (
                            <>
                                <Link
                                    to={`/event-posts/edit/${eventPost.id}`}
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

                        <Link to="/event-posts" className="btn btn-secondary">
                            Назад
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventPostDetails;