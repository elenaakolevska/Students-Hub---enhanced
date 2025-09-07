import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer';
import postRepository from '../../repository/postRepository';

const Home = () => {
    const [latestPosts, setLatestPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getCategoryColor = (category) => {
        if (!category) return '#0d6efd';

        const colors = {
            'EVENT': '#fd7e14',        // orange
            'INTERNSHIP': '#0d6efd',   // blue
            'TRANSPORT': '#6f42c1',    // purple
            'HOUSING': '#198754',      // green
            'MATERIAL': '#dc3545',     // red
            'TUTOR': '#20c997'         // teal
        };

        return colors[category] || '#0d6efd';
    };

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                setLoading(true);
                const response = await postRepository.getLatest();
                setLatestPosts(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching latest posts:", err);
                setError(err.message || 'Грешка при вчитување на најнови објави');
            } finally {
                setLoading(false);
            }
        };

        fetchLatestPosts();
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Navbar */}


            <main className="flex-grow-1">
                {/* Hero Section */}
                <section className="position-relative d-flex align-items-center justify-content-center text-white" style={{ minHeight: '100vh', backgroundColor: '#000' }}>
                    <img src="/images/hero-bg.jpg" alt="Banner" className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover opacity-75" style={{ zIndex: 0 }} />
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7))', zIndex: 1 }}></div>
                    <div className="container position-relative text-center px-4" style={{ zIndex: 2 }}>
                        <h1 className="hero-title" style={{
                            fontWeight: '800',
                            fontSize: 'calc(2.5rem + 3vw)',
                            marginBottom: '1.5rem',
                            textShadow: '2px 2px 8px rgba(0,0,0,0.7)'
                        }}>
                            <span className="text-primary">Student's</span> <span style={{ color: '#fd7e14' }}>Hub</span>
                        </h1>
                        <p className="hero-text" style={{
                            textShadow: '1px 1px 6px rgba(0,0,0,0.6)',
                            maxWidth: '800px',
                            margin: 'auto',
                            fontSize: 'calc(1.2rem + 0.6vw)',
                            fontWeight: '500',
                            lineHeight: '1.5'
                        }}>
                            Омилената студентска заедница, направена од студенти за студенти.
                        </p>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="container my-5 py-4">
                    <h2 className="text-center mb-4 fw-bold">
            <span className="position-relative pb-3" style={{ color: '#2c3e50' }}>
              Категории
              <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  height: '4px',
                  width: '60px',
                  backgroundColor: '#fd7e14',
                  borderRadius: '2px',
                  display: 'block'
              }}></span>
            </span>
                    </h2>

                    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 mt-4">
                        <div className="col">
                            <Link to="/event-posts" className="text-decoration-none">
                                <div className="card text-center h-100 shadow hover-card" style={{
                                    borderRadius: '10px',
                                    transition: 'all 0.3s ease',
                                    overflow: 'hidden'
                                }}>
                                    <div className="card-body py-4">
                                        <div className="category-icon mb-3">
                                            <i className="bi bi-calendar-event" style={{ fontSize: '2.5rem', color: '#fd7e14' }}></i>
                                        </div>
                                        <h5 className="card-title fw-bold">Настани</h5>
                                        <p className="text-muted mb-0">Најди настани, конференции и забави</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="col">
                            <Link to="/internship-posts" className="text-decoration-none">
                                <div className="card text-center h-100 shadow hover-card" style={{
                                    borderRadius: '10px',
                                    transition: 'all 0.3s ease',
                                    overflow: 'hidden'
                                }}>
                                    <div className="card-body py-4">
                                        <div className="category-icon mb-3">
                                            <i className="bi bi-briefcase" style={{ fontSize: '2.5rem', color: '#0d6efd' }}></i>
                                        </div>
                                        <h5 className="card-title fw-bold">Пракса</h5>
                                        <p className="text-muted mb-0">Пронајди можности за практикантска работа</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="col">
                            <Link to="/transport-posts" className="text-decoration-none">
                                <div className="card text-center h-100 shadow hover-card" style={{
                                    borderRadius: '10px',
                                    transition: 'all 0.3s ease',
                                    overflow: 'hidden'
                                }}>
                                    <div className="card-body py-4">
                                        <div className="category-icon mb-3">
                                            <i className="bi bi-car-front" style={{ fontSize: '2.5rem', color: '#6f42c1' }}></i>
                                        </div>
                                        <h5 className="card-title fw-bold">Превоз</h5>
                                        <p className="text-muted mb-0">Транспорт, патување и споделени возења</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="col">
                            <Link to="/housing-posts" className="text-decoration-none">
                                <div className="card text-center h-100 shadow hover-card" style={{
                                    borderRadius: '10px',
                                    transition: 'all 0.3s ease',
                                    overflow: 'hidden'
                                }}>
                                    <div className="card-body py-4">
                                        <div className="category-icon mb-3">
                                            <i className="bi bi-house-door" style={{ fontSize: '2.5rem', color: '#198754' }}></i>
                                        </div>
                                        <h5 className="card-title fw-bold">Сместување</h5>
                                        <p className="text-muted mb-0">Најди соодветно место за живеење</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="col">
                            <Link to="/material-posts" className="text-decoration-none">
                                <div className="card text-center h-100 shadow hover-card" style={{
                                    borderRadius: '10px',
                                    transition: 'all 0.3s ease',
                                    overflow: 'hidden'
                                }}>
                                    <div className="card-body py-4">
                                        <div className="category-icon mb-3">
                                            <i className="bi bi-file-earmark-text" style={{ fontSize: '2.5rem', color: '#dc3545' }}></i>
                                        </div>
                                        <h5 className="card-title fw-bold">Материјали</h5>
                                        <p className="text-muted mb-0">Едукативни материјали и ресурси</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="col">
                            <Link to="/tutor-posts" className="text-decoration-none">
                                <div className="card text-center h-100 shadow hover-card" style={{
                                    borderRadius: '10px',
                                    transition: 'all 0.3s ease',
                                    overflow: 'hidden'
                                }}>
                                    <div className="card-body py-4">
                                        <div className="category-icon mb-3">
                                            <i className="bi bi-mortarboard" style={{ fontSize: '2.5rem', color: '#20c997' }}></i>
                                        </div>
                                        <h5 className="card-title fw-bold">Тутори</h5>
                                        <p className="text-muted mb-0">Пронајди приватни часови и тутори</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Add CSS for hover effect */}
                    <style>{`
            .hover-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
            }
          `}</style>
                </section>

                {/* Latest News Section */}
                <section className="bg-light py-5">
                    <div className="container">
                        <h2 className="text-center mb-4 fw-bold">
              <span className="position-relative pb-3" style={{ color: '#2c3e50' }}>
                Најнови објави
                <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    height: '4px',
                    width: '60px',
                    backgroundColor: '#fd7e14',
                    borderRadius: '2px',
                    display: 'block'
                }}></span>
              </span>
                        </h2>

                        {loading ? (
                            <div className="text-center my-5">
                                <div className="spinner-border" role="status" style={{ color: '#fd7e14' }}>
                                    <span className="visually-hidden">Вчитување...</span>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger text-center" role="alert">
                                {error}
                            </div>
                        ) : latestPosts.length === 0 ? (
                            <div className="alert alert-info text-center" role="alert">
                                Моментално нема објави.
                            </div>
                        ) : (
                            <div className="row g-4 mt-3">
                                {latestPosts.map((post) => (
                                    <div className="col-md-4" key={post.id}>
                                        <div className="card news-card h-100 shadow hover-card" style={{
                                            borderRadius: '10px',
                                            transition: 'all 0.3s ease',
                                            overflow: 'hidden'
                                        }}>
                                            <div className="card-body">
                                                <h5 className="card-title fw-bold">{post.title}</h5>
                                                {post.category && (
                                                    <span className="badge" style={{
                                                        backgroundColor: getCategoryColor(post.category),
                                                        marginBottom: '10px',
                                                        display: 'inline-block'
                                                    }}>
                            {post.category}
                          </span>
                                                )}
                                                <p className="card-text">
                                                    {post.description && post.description.length > 100
                                                        ? `${post.description.substring(0, 100)}...`
                                                        : post.description || 'Нема опис'}
                                                </p>
                                            </div>
                                            <div className="card-footer bg-transparent">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        {post.createdAt && (
                                                            <p className="text-muted mb-0"><small><i className="bi bi-calendar3"></i> {new Date(post.createdAt).toLocaleDateString('mk-MK')}</small></p>
                                                        )}
                                                        {post.ownerUsername && (
                                                            <p className="text-muted mb-0"><small><i className="bi bi-person"></i> {post.ownerUsername}</small></p>
                                                        )}
                                                    </div>
                                                    <Link
                                                        to={`/${post.category?.toLowerCase()}-posts/${post.id}`}
                                                        className="btn btn-sm" style={{
                                                        backgroundColor: getCategoryColor(post.category),
                                                        color: 'white'
                                                    }}
                                                    >
                                                        <i className="bi bi-eye me-1"></i> Види повеќе
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* About Us Section */}
                <section className="container py-5 my-4">
                    <h2 className="text-center mb-5 fw-bold">
            <span className="position-relative pb-3" style={{ color: '#2c3e50' }}>
              За нас
              <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  height: '4px',
                  width: '60px',
                  backgroundColor: '#fd7e14',
                  borderRadius: '2px',
                  display: 'block'
              }}></span>
            </span>
                    </h2>

                    <div className="about-section">
                        <div className="row align-items-center g-4">
                            <div className="col-md-6">
                                <div className="position-relative">
                                    <img
                                        src="/images/about.jpg"
                                        alt="About Us"
                                        className="img-fluid rounded"
                                        style={{
                                            width: '100%',
                                            height: '400px',
                                            objectFit: 'cover',
                                            borderRadius: '10px',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                                        }}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: '-20px',
                                            right: '-20px',
                                            width: '120px',
                                            height: '120px',
                                            backgroundColor: '#fd7e14',
                                            borderRadius: '50%',
                                            zIndex: -1
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <h3 className="mb-4 fw-bold" style={{ color: '#2c3e50' }}>Нашата Мисија</h3>
                                <p className="lead">
                                    Ние сме тим на ентузијасти што ја направија оваа апликација за да го олесниме студентскиот живот во Скопје. Нашата платформа е создадена од студенти, за студенти.
                                </p>
                                <p>
                                    Веруваме дека секој заслужува да има пристап до корисни информации, поддршка и можности за развој – сè на едно место.
                                </p>
                                <div className="mt-4">
                                    <Link
                                        to="/about"
                                        className="btn btn-lg px-4"
                                        style={{
                                            backgroundColor: '#fd7e14',
                                            color: 'white',
                                            borderRadius: '30px'
                                        }}
                                    >
                                        <i className="bi bi-info-circle me-2"></i> Дознај повеќе
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;