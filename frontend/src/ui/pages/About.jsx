import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer';

const About = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1" style={{ backgroundColor: '#fff8f0' }}>


        {/* Main Content */}
        <div className="container" style={{ marginTop: '3rem', marginBottom: '5rem' }}>
          <div className="row g-5">
            <div className="col-lg-7">
              <div 
                className="bg-white p-4 p-md-5 rounded shadow-sm" 
                style={{ 
                  backgroundColor: '#fff3e6',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(255, 149, 0, 0.2)'
                }}
              >
                <h2 className="fw-bold mb-4" style={{ color: '#fd7e14' }}>Нашата Мисија</h2>
                <p className="lead mb-4">
                  Ние сме група студенти кои го создадоа Student Hub – онлајн платформа што го олеснува секојдневниот живот на студентите во Скопје.
                </p>
                <ul className="list-group list-group-flush mb-4" style={{ fontSize: '1.1rem' }}>
                  <li className="list-group-item border-0" style={{ backgroundColor: 'transparent' }}>
                    <i className="bi bi-check-circle-fill me-2 text-primary"></i>
                    Најди превоз до дома
                  </li>
                  <li className="list-group-item border-0" style={{ backgroundColor: 'transparent' }}>
                    <i className="bi bi-check-circle-fill me-2 text-primary"></i>
                    Споделувај и преземај материјали
                  </li>
                  <li className="list-group-item border-0" style={{ backgroundColor: 'transparent' }}>
                    <i className="bi bi-check-circle-fill me-2 text-primary"></i>
                    Запознај се и комуницирај со други студенти
                  </li>
                  <li className="list-group-item border-0" style={{ backgroundColor: 'transparent' }}>
                    <i className="bi bi-check-circle-fill me-2 text-primary"></i>
                    Барај пракси и развивај се професионално
                  </li>
                  <li className="list-group-item border-0" style={{ backgroundColor: 'transparent' }}>
                    <i className="bi bi-check-circle-fill me-2 text-primary"></i>
                    Најди тутори и совладај го материјалот полесно
                  </li>
                </ul>
                <p className="lead">
                  Нашата мисија е да изградиме дигитална заедница заснована на солидарност, знаење и напредок.
                </p>
                
                <div className="mt-5">
                  <Link 
                    to="/" 
                    className="btn btn-lg px-4" 
                    style={{ 
                      backgroundColor: '#fd7e14', 
                      color: 'white',
                      borderRadius: '30px'
                    }}
                  >
                    <i className="bi bi-house-door me-2"></i> Врати се на почетна
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="d-flex flex-column gap-4">
                <div className="position-relative">
                  <img 
                    src="/images/about1.jpg" 
                    alt="Студенти кои разговараат"
                    className="img-fluid rounded shadow"
                    style={{ 
                      width: '100%', 
                      height: '300px', 
                      objectFit: 'cover',
                      borderRadius: '10px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '-15px', 
                      right: '-15px', 
                      width: '80px', 
                      height: '80px', 
                      backgroundColor: '#fd7e14',
                      borderRadius: '50%',
                      zIndex: -1
                    }}
                  ></div>
                </div>
                <div className="position-relative">
                  <img 
                    src="/images/about2.jpg" 
                    alt="Учење со лаптоп"
                    className="img-fluid rounded shadow"
                    style={{ 
                      width: '100%', 
                      height: '300px', 
                      objectFit: 'cover',
                      borderRadius: '10px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <div 
                    style={{ 
                      position: 'absolute', 
                      bottom: '-15px', 
                      left: '-15px', 
                      width: '80px', 
                      height: '80px', 
                      backgroundColor: '#0d6efd',
                      borderRadius: '50%',
                      zIndex: -1
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Team Section */}
          <div className="text-center my-5 pt-5">
            <h2 className="fw-bold mb-5">
              <span className="position-relative pb-3" style={{ color: '#2c3e50' }}>
                Нашиот Тим
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
            
            <p className="lead mb-5 mx-auto" style={{ maxWidth: '800px' }}>
              Наш тим е посветен кон подобрување на студентскиот живот. Заедно со нашата заедница, 
              создаваме платформа што е навистина корисна за сите студенти.
            </p>
            
            <div className="row row-cols-1 row-cols-md-3 g-4 mt-4">
              <div className="col">
                <div className="card h-100 border-0 shadow-sm hover-card">
                  <div className="card-body p-4">
                    <div className="mb-4">
                      <i className="bi bi-people-fill" style={{ fontSize: '3rem', color: '#fd7e14' }}></i>
                    </div>
                    <h4 className="card-title fw-bold">Заедница</h4>
                    <p className="card-text">Градиме заедница каде студентите можат да соработуваат и да си помагаат меѓусебно.</p>
                  </div>
                </div>
              </div>
              
              <div className="col">
                <div className="card h-100 border-0 shadow-sm hover-card">
                  <div className="card-body p-4">
                    <div className="mb-4">
                      <i className="bi bi-lightning-charge-fill" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
                    </div>
                    <h4 className="card-title fw-bold">Иновација</h4>
                    <p className="card-text">Постојано бараме нови начини да ги решиме проблемите со кои се соочуваат студентите.</p>
                  </div>
                </div>
              </div>
              
              <div className="col">
                <div className="card h-100 border-0 shadow-sm hover-card">
                  <div className="card-body p-4">
                    <div className="mb-4">
                      <i className="bi bi-shield-check" style={{ fontSize: '3rem', color: '#198754' }}></i>
                    </div>
                    <h4 className="card-title fw-bold">Доверба</h4>
                    <p className="card-text">Градиме однос заснован на доверба и сигурност со нашите корисници.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add style for hover effect */}
      <style>{`
        .hover-card {
          transition: all 0.3s ease;
          border-radius: 10px;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default About;
