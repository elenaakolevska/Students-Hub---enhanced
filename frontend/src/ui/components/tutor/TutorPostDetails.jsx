import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import tutorPostRepository from '../../../repository/tutorPostRepository';

const TutorPostDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await tutorPostRepository.findById(id);
                setPost(response.data);
                setError(null);
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
    }, [id]);

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
                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={() => {
                                            // TODO: Implement favorites functionality
                                            console.log('Adding to favorites:', post.id);
                                        }}
                                    >
                                        ♥ Додај во омилени
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
