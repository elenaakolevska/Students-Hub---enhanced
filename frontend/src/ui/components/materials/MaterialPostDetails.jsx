import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import materialPostRepository from '../../../repository/materialPostRepository.js';
import authContext from '../../../contexts/authContext.js';

const MaterialPostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(authContext);
    const [materialPost, setMaterialPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await materialPostRepository.findById(id);
                setMaterialPost(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Дали сте сигурни дека сакате да го избришете материјалот?')) {
            try {
                await materialPostRepository.delete(id);
                navigate('/material-posts');
            } catch (err) {
                console.error('Error deleting material post:', err);
            }
        }
    };

    const handleDownload = async () => {
        try {
            const response = await materialPostRepository.download(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${materialPost.title}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading file:', error);
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

    if (error || !materialPost) {
        return (
            <div className="container my-5">
                <div className="alert alert-danger" role="alert">
                    Материјалот не е пронајден или има грешка при вчитување.
                </div>
            </div>
        );
    }

    return (
        <section className="container my-5">
            <h2 className="mb-4 text-center fw-bold">{materialPost.title}</h2>

            <div className="card" style={{
                maxWidth: '700px',
                margin: '0 auto',
                boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                backgroundColor: '#fff'
            }}>
                <div className="card-body px-4 py-3">
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Предмет:</strong> <span>{materialPost.subject}</span>
                    </p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Опис:</strong> <span>{materialPost.description}</span>
                    </p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Оцена:</strong> <span>{materialPost.rating}</span>
                    </p>

                    <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                        <strong>Фајл:</strong>
                        <button
                            onClick={handleDownload}
                            className="btn btn-outline-success btn-sm ms-2"
                        >
                            Преземи
                        </button>
                    </p>

                    <div className="mb-3">
                        <strong>Објавил:</strong>
                        <span className="ms-2">{materialPost.owner?.username}</span>
                        <span className="ms-2 text-muted">
                            {new Date(materialPost.createdAt).toLocaleDateString('mk-MK')}
                        </span>
                    </div>

                    <div className="d-flex justify-content-center gap-3 mt-4" style={{ minWidth: '100px' }}>
                        <Link
                            to={`/chat/${materialPost.owner?.username}`}
                            className="btn btn-warning"
                        >
                            Прати порака
                        </Link>

                        {user && user.username === materialPost.owner?.username && (
                            <>
                                <Link
                                    to={`/material-posts/edit/${materialPost.id}`}
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

                        <Link to="/material-posts" className="btn btn-secondary">
                            Назад
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MaterialPostDetails;