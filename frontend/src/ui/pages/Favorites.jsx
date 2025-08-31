import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import favoriteRepository from '../../repository/favoriteRepository';
import postRepository from '../../repository/postRepository';
import Footer from '../Footer';
import authContext from '../../contexts/authContext';
import { toast } from 'react-toastify';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
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
      toast.error("Мора да бидете најавени за да ги видите вашите омилени објави");
      navigate('/login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        // Get username from JWT token (user.sub contains the username)
        const username = user.sub;
        if (!username) {
          setError("Не може да се најде корисничкото име");
          setLoading(false);
          return;
        }
        
        // Fetch user favorites from localStorage (this is synchronous)
        const favoritesResponse = favoriteRepository.getMyFavorites(username);
        const favoriteItems = favoritesResponse.data;
        
        console.log('Fetched favorites from localStorage:', favoriteItems);

        if (!favoriteItems || favoriteItems.length === 0) {
          setFavorites([]);
          setError(null);
          setLoading(false);
          return;
        }

        // For each favorite, fetch the post details
        const postsWithDetails = await Promise.all(
          favoriteItems.map(async (favorite) => {
            try {
              const postResponse = await postRepository.findById(favorite.postId);
              return {
                ...favorite,
                post: postResponse.data
              };
            } catch (err) {
              console.error(`Error fetching post ${favorite.postId}:`, err);
              return {
                ...favorite,
                post: { 
                  id: favorite.postId,
                  title: 'Грешка при вчитување', 
                  description: 'Не може да се вчита објавата',
                  category: 'UNKNOWN',
                  createdAt: favorite.createdAt
                }
              };
            }
          })
        );

        console.log('Posts with details:', postsWithDetails);
        setFavorites(postsWithDetails);
        setError(null);
      } catch (err) {
        setError(err.message || 'Грешка при вчитување на омилените објави');
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, navigate]);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      // Use username from JWT token
      const username = user.sub;
      await favoriteRepository.removeFavorite(username, favoriteId);
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      toast.success('Објавата е отстранета од омилени');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Грешка при отстранување од омилени');
      console.error('Error removing favorite:', err);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
        <section className="container my-5">
          <div className="mb-4">
            <h2 className="fw-bold position-relative pb-3" style={{
              paddingBottom: '15px',
              display: 'inline-block',
              color: '#2c3e50'
            }}>
              Омилени објави
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
            
            <Link to="/" className="btn btn-outline-secondary ms-3">⬅ Назад</Link>
            
            {user && (
              <p className="text-muted mt-3">Омилени објави на: {user.username || user.sub}</p>
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
          ) : favorites.length === 0 ? (
            <div className="alert alert-info" role="alert">
              <p>Немате омилени објави.</p>
              <div className="mt-3">
                <Link to="/" className="btn btn-primary">
                  <i className="bi bi-search me-2"></i>
                  Разгледајте објави
                </Link>
              </div>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {favorites.map((favorite) => (
                <div className="col" key={favorite.id}>
                  <div className="card h-100 shadow-sm hover-card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <h5 className="card-title">{favorite.post?.title}</h5>
                        {favorite.post?.category && (
                          <span className={`badge ${getCategoryColor(favorite.post.category)}`}>
                            {favorite.post.category}
                          </span>
                        )}
                      </div>
                      <p className="card-text mb-1">
                        <strong>Опис:</strong> {favorite.post?.description?.length > 100 
                          ? `${favorite.post.description.substring(0, 100)}...` 
                          : favorite.post?.description}
                      </p>
                      {favorite.post?.createdAt && (
                        <p className="card-text mb-1">
                          <strong>Датум:</strong> {new Date(favorite.post.createdAt).toLocaleDateString('mk-MK')}
                        </p>
                      )}
                      {favorite.post?.owner?.username && (
                        <p className="card-text mb-3">
                          <strong>Објавил:</strong> {favorite.post.owner.username}
                        </p>
                      )}
                    </div>
                    <div className="card-footer bg-transparent">
                      <div className="d-flex justify-content-between align-items-center">
                        <Link 
                          to={favorite.post?.category ? `/${favorite.post.category.toLowerCase()}-posts/${favorite.post.id}` : '#'} 
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-eye"></i> Детали
                        </Link>
                        <button
                          onClick={() => handleRemoveFavorite(favorite.id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          <i className="bi bi-trash"></i> Избриши
                        </button>
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

export default Favorites;
