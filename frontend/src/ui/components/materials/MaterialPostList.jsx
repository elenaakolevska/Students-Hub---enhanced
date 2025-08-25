import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useMaterialPosts from '../../../hooks/useMaterialPosts.js';
import materialPostRepository from '../../../repository/materialPostRepository.js';

const MaterialPostList = () => {
    const [selectedSubject, setSelectedSubject] = useState('');
    const { materialPosts, subjects, loading, error } = useMaterialPosts(selectedSubject);

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
    };

    const addToFavorites = async (postId) => {
        console.log('Adding to favorites:', postId);
    };

    const handleDownload = async (postId) => {
        try {
            const response = await materialPostRepository.download(postId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `material_${postId}`);
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
            <div className="section-header mt-5" style={{
                padding: '2rem 0',
                textAlign: 'center',
                marginBottom: '3rem'
            }}>
                <h2 className="section-title" style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    color: '#2c3e50',
                    position: 'relative',
                    display: 'inline-block',
                    paddingBottom: '1rem'
                }}>
                    Материјали
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
                    Прелистај и преземи корисни материјали споделени од студентите
                </p>
            </div>

            <div className="mb-4 text-end">
                <Link to="/material-posts/create" className="btn btn-primary">
                    + Додади нов материјал
                </Link>
            </div>

            <form className="row g-3 align-items-center mb-4">
                <div className="col-auto">
                    <label htmlFor="subject" className="col-form-label">Филтер по предмет:</label>
                </div>
                <div className="col-auto">
                    <select
                        name="subject"
                        id="subject"
                        className="form-select"
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                    >
                        <option value="">Сите предмети</option>
                        {subjects.map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                </div>
            </form>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {materialPosts.map(post => (
                    <div key={post.id} className="col">
                        <div className="card h-100">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">
                                    <strong>Предмет:</strong> <span>{post.subject}</span>
                                </p>
                                <p className="card-text">
                                    <strong>Опис:</strong> <span>{post.description}</span>
                                </p>
                                <p className="card-text">
                                    <strong>Оцена:</strong> <span>{post.rating}</span>
                                </p>

                                <Link
                                    to={`/material-posts/${post.id}`}
                                    className="btn btn-info mt-auto text-white"
                                >
                                    Види детали
                                </Link>

                                <button
                                    onClick={() => handleDownload(post.id)}
                                    className="btn btn-outline-success btn-sm mt-2"
                                >
                                    Преземи
                                </button>

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

            {materialPosts.length === 0 && (
                <div className="text-center mt-5">
                    <p className="text-muted">Нема пронајдени материјали за избраниот предмет.</p>
                </div>
            )}
        </div>
    );
};

export default MaterialPostList;