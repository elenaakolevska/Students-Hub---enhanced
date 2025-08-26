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
                        <span className="visually-hidden">Вчитување детали за пракса...</span>
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
                <Link to="/internship-posts" className="btn btn-primary">
                    Назад кон листа
                </Link>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container my-5">
                <div className="alert alert-warning" role="alert">
                    Праксата не е пронајдена.
                </div>
                <Link to="/internship-posts" className="btn btn-primary">
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
                                    <h5 className="text-muted">Детали за пракса</h5>
                                    <p className="mb-2">
                                        <strong>Компанија:</strong> <span>{post.company}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Позиција:</strong> <span>{post.position}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Факултет:</strong> <span>{post.facultyFilter}</span>
                                    </p>
                                    {post.logoUrl && (
                                        <div className="mb-3">
                                            <h5 className="text-muted">Лого на компанијата</h5>
                                            <img
                                                src={post.logoUrl}
                                                alt="Лого на компанијата"
                                                style={{ maxHeight: '200px', objectFit: 'contain' }}
                                                className="img-fluid"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5 className="text-muted">Опис</h5>
                                <p className="lead">{post.description}</p>
                            </div>

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
                                    to="/internship-posts"
                                    className="btn btn-outline-primary"
                                >
                                    ← Назад кон листа
                                </Link>
                                <div>
                                    {user && user.id === post.userId && (
                                        <>
                                            <Link
                                                to={`/internship-posts/edit/${post.id}`}
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
                                        className="btn btn-outline-danger"
                                        onClick={() => {
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

export default InternshipPostDetails;
