import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useInternshipPosts from '../../../hooks/useInternshipPosts.js';

const InternshipPostList = () => {
    const [facultyFilter, setFacultyFilter] = useState('');
    const { internshipPosts, loading, error } = useInternshipPosts(facultyFilter);

    const handleFacultyChange = (e) => {
        setFacultyFilter(e.target.value);
    };

    const addToFavorites = async (postId) => {
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
        <section className="container my-5">
            <div className="section-header" style={{
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
                    Пракса
                </h2>
                <p className="section-subtitle" style={{
                    color: '#6c757d',
                    fontSize: '1.1rem',
                    marginTop: '1rem',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    Изгради се на професионално ниво и стекни ново искуство
                </p>
            </div>

            <div className="mb-4 text-end">
                <Link to="/internship-posts/create" className="btn btn-primary">
                    + Додади нова пракса
                </Link>
            </div>

            <form className="row g-3 align-items-center mb-4">
                <div className="col-auto">
                    <label htmlFor="faculty" className="col-form-label">Филтер по факултет:</label>
                </div>
                <div className="col-auto">
                    <input
                        type="text"
                        id="faculty"
                        className="form-control"
                        placeholder="Пр. Computer Science"
                        value={facultyFilter}
                        onChange={handleFacultyChange}
                    />
                </div>
            </form>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {internshipPosts.map(post => (
                    <div key={post.id} className="col">
                        <div className="card h-100">
                            {post.logoUrl && (
                                <img
                                    src={post.logoUrl}
                                    className="card-img-top"
                                    alt="Лого на компанија"
                                    style={{ height: '200px', objectFit: 'contain' }}
                                />
                            )}
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">
                                    <strong>Компанија:</strong> <span>{post.company}</span>
                                </p>
                                <p className="card-text">
                                    <strong>Факултет:</strong> <span>{post.facultyFilter}</span>
                                </p>
                                <p className="card-text">
                                    <strong>Позиција:</strong> <span>{post.position}</span>
                                </p>
                                <p className="card-text">
                                    <strong>Опис:</strong> <span>{post.description}</span>
                                </p>
                                <p className="card-text">
                                    <strong>Датум:</strong>
                                    <span>
                                        {post.createdAt ?
                                            new Date(post.createdAt).toLocaleDateString('mk-MK') :
                                            'Нема датум'
                                        }
                                    </span>
                                </p>

                                <Link
                                    to={`/internship-posts/${post.id}`}
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

            {internshipPosts.length === 0 && (
                <div className="text-center mt-5">
                    <p className="text-muted">Нема пронајдени пракси за избраниот факултет.</p>
                </div>
            )}
        </section>
    );
};

export default InternshipPostList;