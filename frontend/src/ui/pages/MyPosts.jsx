import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import postRepository from '../../repository/postRepository';
import NavigationBar from '../Navigation';
import Footer from '../Footer';
import authContext from '../../contexts/authContext';
import { toast } from 'react-toastify';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(authContext);
  const navigate = useNavigate();

  // Helper function to determine badge color based on category
  const getCategoryColor = (category) => {
    switch (category) {
      case 'EVENT': return 'bg-danger';
      case 'INTERNSHIP': return 'bg-success';
      case 'TRANSPORT': return 'bg-info';
      case 'HOUSING': return 'bg-warning';
      case 'MATERIAL': return 'bg-secondary';
      case 'TUTOR': return 'bg-primary';
      default: return 'bg-secondary';
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      toast.error("Мора да бидете најавени за да ги видите вашите објави");
      navigate('/login');
      return;
    }

    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        const response = await postRepository.getMyPosts();
        setPosts(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Грешка при вчитување на објавите');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [user, navigate]);

  // Function to handle post deletion
  const handleDeletePost = async (id) => {
    if (window.confirm('Дали сте сигурни дека сакате да ја избришете оваа објава?')) {
      try {
        await postRepository.deleteById(id);
        toast.success('Објавата е успешно избришана');
        // Update posts list after deletion
        setPosts(posts.filter(post => post.id !== id));
      } catch (err) {
        toast.error(err.response?.data?.message || 'Грешка при бришење на објавата');
        console.error('Error deleting post:', err);
      }
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavigationBar />
      <main className="flex-grow-1">
        <section className="container my-5">
          <div className="mb-4">
            <h2 className="fw-bold position-relative pb-3" style={{
              paddingBottom: '15px',
              display: 'inline-block',
              color: '#2c3e50'
            }}>
              Моите објави
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '4px',
                width: '60px',
                backgroundColor: '#fd7e14',
                borderRadius: '2px'
              }}></span>
            </h2>
            {user && (
              <p className="text-muted">Објави од: {user.username}</p>
            )}
          </div>

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Вчитување...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="alert alert-info" role="alert">
              <p>Немате објави.</p>
              <div className="mt-3">
                <Link to="/create-post" className="btn btn-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Создадете нова објава
                </Link>
              </div>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {posts.map((post) => (
                <div className="col" key={post.id}>
                  <div className="card h-100 shadow-sm hover-card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <h5 className="card-title">{post.title}</h5>
                        {post.category && (
                          <span className={`badge ${getCategoryColor(post.category)}`}>
                            {post.category}
                          </span>
                        )}
                      </div>
                      <p className="card-text">
                        {post.description.length > 100 
                          ? `${post.description.substring(0, 100)}...` 
                          : post.description}
                      </p>
                    </div>
                    <div className="card-footer bg-transparent">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="bi bi-calendar me-1"></i>
                          {new Date(post.createdAt).toLocaleDateString('mk-MK')}
                        </small>
                        <div className="btn-group">
                          <Link
                            to={`/${post.category?.toLowerCase()}-posts/${post.id}`} 
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          <Link
                            to={`/${post.category?.toLowerCase()}-posts/edit/${post.id}`} 
                            className="btn btn-sm btn-outline-secondary"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MyPosts;
