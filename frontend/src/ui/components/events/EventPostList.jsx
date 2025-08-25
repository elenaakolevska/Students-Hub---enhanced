import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useEventPosts from '../../../hooks/useEventPosts.js';

const EventPostList = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const { eventPosts, loading, error } = useEventPosts(selectedCategory);

    const eventCategories = [
        'ACADEMIC', 'CULTURAL', 'SPORTS', 'SOCIAL', 'WORKSHOP', 'CONFERENCE'
    ];

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const addToFavorites = async (postId) => {
        // Implement favorites functionality
        console.log('Adding to favorites:', postId);
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

    if (error) {
        return (
            <div className="container my-5">
                <div className="alert alert-danger" role="alert">
                    Грешка при вчитување: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container my-5">
            {/* Header */}
            <div className="section-header mt-5" style={{ padding: '2rem 0', textAlign: 'center', marginBottom: '3rem' }}>
                <h2 className="section-title" style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    color: '#2c3e50',
                    position: 'relative',
                    display: 'inline-block',
                    paddingBottom: '1rem'
                }}>
                    Настани
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
                    Истражете ги најновите и најинтересните настани во студентската заедница
                </p>
            </div>

            {/* Add New Event Button */}
            <div className="mb-4 text-end">
                <Link to="/event-posts/create" className="btn btn-primary">
                    + Додади нов настан
                </Link>
            </div>

            {/* Filter Form */}
            <form className="row g-3 align-items-center mb-4">
                <div className="col-auto">
                    <label htmlFor="category" className="col-form-label">Филтер по категорија:</label>
                </div>
                <div className="col-auto">
                    <select
                        name="category"
                        id="category"
                        className="form-select"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="">Сите категории</option>
                        {eventCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </form>

            {/* Event Posts Grid */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {eventPosts.map(post => (
                    <div key={post.id} className="col">
                        <div className="card h-100">
                            <img
                                src={post.imageUrl || '/images/default-event.jpg'}
                                className="card-img-top"
                                alt="Слика од настанот"
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">
                                    <strong>Категорија:</strong> {post.eventCategory}
                                </p>
                                <p className="card-text">
                                    <strong>Локација:</strong> {post.location}
                                </p>
                                <p className="card-text">
                                    <strong>Влез:</strong>
                                    {post.free ? ' Слободен' : ` ${post.price} ден.`}
                                </p>
                                <p className="card-text">
                                    <strong>Опис:</strong> {post.description}
                                </p>
                                <p className="card-text">
                                    <strong>Организатор:</strong> {post.organizer}
                                </p>

                                <Link
                                    to={`/event-posts/${post.id}`}
                                    className="btn btn-info mt-auto text-white"
                                >
                                    Види детали
                                </Link>

                                <button
                                    onClick={() => addToFavorites(post.id)}
                                    className="btn btn-outline-danger w-100 mt-2"
                                >
                                    Додај во омилени
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {eventPosts.length === 0 && (
                <div className="text-center mt-5">
                    <p className="text-muted">Нема пронајдени настани за избраната категорија.</p>
                </div>
            )}
        </div>
    );
};

export default EventPostList;