import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import internshipPostRepository from '../../../repository/internshipPostRepository.js';
import authContext from '../../../contexts/authContext.js';

const InternshipPostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(authContext);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await internshipPostRepository.findById(id);
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
        if (window.confirm('Дали сте сигурни дека сакате да ја избришете праксата?')) {
            try {
                await internshipPostRepository.delete(id);
                navigate('/internship-posts');
            } catch (err) {
                console.error('Error deleting internship post:', err);
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
                    Праксата не е пронајдена или има грешка при вчитување.
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
                <img
                    src={post.logoUrl || '/images/default-company.jpg'}
                    alt="Слика од компанијата"
                    style={{ height: '320px', objectFit: 'cover', width: '100%' }}
                />

                <div className="card-body px-4 py-3">
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Компанија:</strong> <span>{post.company}</span>
                    </p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Факултет:</strong> <span>{post.facultyFilter}</span>
                    </p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Позиција:</strong> <span>{post.position}</span>
                    </p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Опис:</strong> <span>{post.description}</span>
                    </p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Датум:</strong>
                        <span>
                            {post.createdAt ?
                                new Date(post.createdAt).toLocaleDateString('mk-MK') :
                                'Нема датум'
                            }
                        </span>
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
                                    to={`/internship-posts/edit/${post.id}`}
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

                        <Link to="/internship-posts" className="btn btn-secondary">
                            Назад
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InternshipPostDetails;
