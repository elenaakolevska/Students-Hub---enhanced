
import React, { useEffect, useState } from 'react';
import NavigationBar from '../Navigation';
import Footer from '../Footer';
import { Swiper, SwiperSlide } from 'swiper/react';

// You can replace this with an actual API call
const fetchLatestPosts = async () => {
  // Example: return fetch('/api/posts/latest').then(res => res.json());
  return [
    { id: 1, title: 'Наслов 1', description: 'Опис 1', createdAt: new Date() },
    { id: 2, title: 'Наслов 2', description: 'Опис 2', createdAt: new Date() },
    { id: 3, title: 'Наслов 3', description: 'Опис 3', createdAt: new Date() },
  ];
};

const Home = () => {
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    fetchLatestPosts().then(setLatestPosts);
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <NavigationBar />

      <main className="flex-grow-1">
        {/* Hero Section */}
        <section className="position-relative d-flex align-items-center justify-content-center text-white" style={{ minHeight: '100vh', backgroundColor: '#000' }}>
          <img src="/images/hero-bg.jpg" alt="Banner" className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover opacity-75" style={{ zIndex: 0 }} />
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7))', zIndex: 1 }}></div>
          <div className="container position-relative text-center px-4" style={{ zIndex: 2 }}>
            <h1 className="hero-title fw-bold">
              <span className="text-primary">Student's</span> <span style={{ color: '#fd7e14' }}>Hub</span>
            </h1>
            <p className="hero-text" style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.6)', maxWidth: 800, margin: 'auto' }}>
              Омилената студентска заедница, направена од студенти за студенти.
            </p>
          </div>
        </section>

        {/* Categories Carousel */}
        <section className="container my-5">
          <h2 className="text-center mb-4">Категории</h2>
          <Swiper
            className="mySwiper"
            slidesPerView={3}
            spaceBetween={20}
            loop={true}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              1024: { slidesPerView: 3 },
              768: { slidesPerView: 2 },
              0: { slidesPerView: 1 },
            }}
          >
            <SwiperSlide>
              <a href="/event-posts" className="text-decoration-none">
                <div className="card text-center h-100 shadow-lg d-flex flex-column justify-content-center">
                  <div className="card-body">
                    <h5 className="card-title">Настани</h5>
                  </div>
                </div>
              </a>
            </SwiperSlide>
            <SwiperSlide>
              <a href="/internship-posts" className="text-decoration-none">
                <div className="card text-center h-100 shadow-lg d-flex flex-column justify-content-center">
                  <div className="card-body">
                    <h5 className="card-title">Пракса</h5>
                  </div>
                </div>
              </a>
            </SwiperSlide>
            <SwiperSlide>
              <a href="/transport-posts" className="text-decoration-none">
                <div className="card text-center h-100 shadow-lg d-flex flex-column justify-content-center">
                  <div className="card-body">
                    <h5 className="card-title">Превоз</h5>
                  </div>
                </div>
              </a>
            </SwiperSlide>
            <SwiperSlide>
              <a href="/housing-posts" className="text-decoration-none">
                <div className="card text-center h-100 shadow-lg d-flex flex-column justify-content-center">
                  <div className="card-body">
                    <h5 className="card-title">Сместување</h5>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          </Swiper>
        </section>

        {/* Latest News Section */}
        <section className="bg-light py-5">
          <div className="container">
            <h2 className="section-title text-center">Најнови објави</h2>
            <div className="row g-4">
              {latestPosts.map((post) => (
                <div className="col-md-4" key={post.id}>
                  <div className="card news-card p-3">
                    <h5>{post.title}</h5>
                    <p>{post.description}</p>
                    <p><small>{new Date(post.createdAt).toLocaleString('mk-MK')}</small></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="container py-5">
          <h2 className="section-title text-center">За нас</h2>
          <div className="about-section">
            <div className="row align-items-center">
              <div className="col-md-6">
                <img src="/images/about.jpg" alt="About Us" className="img-fluid rounded shadow-lg" style={{ maxHeight: 400, width: '100%', objectFit: 'cover' }} />
              </div>
              <div className="col-md-6">
                <h3 className="mb-4">Нашата Мисија</h3>
                <p className="lead">Ние сме тим на ентузијасти што ја направија оваа апликација за да го олесниме студентскиот живот во Скопје. Нашата платформа е создадена од студенти, за студенти. Веруваме дека секој заслужува да има пристап до корисни информации, поддршка и можности за развој – сè на едно место.</p>
                <div className="mt-4">
                  <a href="/about" className="btn btn-primary">Дознај повеќе</a>
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
