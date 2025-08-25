import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import transportPostRepository from '../../../repository/transportPostRepository.js';

const TransportPostDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await transportPostRepository.findById(id);
                setPost(response.data);
            } catch (err) {
                setError('Грешка при вчитување на деталите за превоз');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
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
                <Link to="/transport-posts" className="btn btn-secondary mt-3">Назад</Link>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container my-5 text-center">
                <p className="text-muted">Не се пронајдени детали за оваа понуда.</p>
                <Link to="/transport-posts" className="btn btn-secondary mt-3">Назад</Link>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <div className="card mx-auto" style={{ maxWidth: '600px' }}>
                <div className="card-body">
                    <h2 className="card-title mb-4">{post.title}</h2>
                    <p className="card-text"><strong>Провајдер:</strong> {post.providerName}</p>
                    <p className="card-text"><strong>Од:</strong> {post.locationFrom}</p>
                    <p className="card-text"><strong>До:</strong> {post.locationTo}</p>
                    <p className="card-text"><strong>Цена:</strong> {post.price} ден.</p>
                    <p className="card-text"><strong>Време на поаѓање:</strong> {post.departureDatetime ? new Date(post.departureDatetime).toLocaleString('mk-MK') : 'Нема податок'}</p>
                    <p className="card-text"><strong>Контакт:</strong> {post.contactInfo}</p>
                    <p className="card-text"><strong>Опис:</strong> {post.description}</p>
                    {post.category && <p className="card-text"><strong>Категорија:</strong> {post.category}</p>}
                    <Link to="/transport-posts" className="btn btn-secondary mt-4">Назад</Link>
                </div>
            </div>
        </div>
    );
};

export default TransportPostDetails;

