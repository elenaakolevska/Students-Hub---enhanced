import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navigation from '../Navigation';
import Footer from '../Footer';
import groupChatRepository from '../../repository/groupChatRepository';
import './GroupChat.css';
import './GroupChatStyles.css';
import { motion } from 'framer-motion';

const GroupChatList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await groupChatRepository.getMyGroupChats();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Грешка при вчитување на групите');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    if (window.confirm('Дали сте сигурни дека сакате да ја напуштите оваа група?')) {
      try {
        const currentUser = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).sub;
        await groupChatRepository.removeMember(groupId, currentUser);
        toast.success('Успешно ја напуштивте групата');
        fetchGroups(); // Refresh the list
      } catch (error) {
        console.error('Error leaving group:', error);
        toast.error('Грешка при напуштање на групата');
      }
    }
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* <Navigation /> */}
      <main className="container flex-grow-1 py-4">
        <div className="card mb-4 shadow-sm border-0 bg-gradient rounded-3" 
             style={{ backgroundImage: 'linear-gradient(135deg, #0d6efd 0%, #084298 100%)' }}>
          <div className="card-body py-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h2 className="mb-0 text-white d-flex align-items-center">
                  <i className="bi bi-people-fill me-3" style={{ fontSize: '1.8rem' }}></i>
                  Мои Групни Разговори
                </h2>
                <p className="text-white-50 mt-2 mb-0">Управувајте со вашите групни разговори и создадете нови.</p>
              </div>
              <div className="col-md-4 text-md-end mt-3 mt-md-0">
                <Link to="/create-group" className="btn btn-light btn-lg">
                  <i className="bi bi-plus-circle-fill me-2"></i>
                  Создади нова група
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4 border-0">
          <div className="card-body p-2">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0">
                <i className="bi bi-search text-primary"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 py-2"
                placeholder="Пребарај групи по име или опис..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: '1.1rem' }}
              />
              {searchTerm && (
                <button 
                  className="btn btn-link text-secondary border-0" 
                  type="button"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="bi bi-x-circle"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Вчитување...</span>
            </div>
            <p className="mt-3 text-primary fw-medium">Вчитување на групи...</p>
          </div>
        ) : filteredGroups.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredGroups.map((group, index) => (
              <motion.div 
                key={group.id} 
                className="col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="card h-100 group-card shadow-sm hover-shadow border-0">
                  <div className="card-header bg-light py-3 border-0 d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0 text-truncate" style={{ maxWidth: "70%" }}>
                      {group.name}
                    </h5>
                    <span className="badge bg-primary rounded-pill">
                      <i className="bi bi-people-fill me-1"></i>
                      {group.members?.length || 0}
                    </span>
                  </div>
                  
                  <div className="card-body">
                    {group.description && (
                      <div className="mb-3">
                        <p className="card-text text-muted group-description-preview">
                          {group.description}
                        </p>
                      </div>
                    )}
                    
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-person-fill text-primary me-2"></i>
                      <span className="text-muted">
                        Создадена од: <span className="fw-medium">{group.createdBy?.username || 'Непознато'}</span>
                      </span>
                    </div>
                    
                    <div className="group-members-preview">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted fw-medium">Членови:</small>
                        <small className="text-primary">{group.members?.length || 0} вкупно</small>
                      </div>
                      <div className="member-avatars">
                        {group.members?.slice(0, 5).map(member => (
                          <div key={member.id} 
                              className="member-avatar" 
                              title={member.username}
                              style={{ 
                                  backgroundColor: `hsl(${member.username.charCodeAt(0) % 360}, 70%, 50%)`,
                                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                              }}>
                            {member.username.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        
                        {group.members?.length > 5 && (
                          <div className="member-avatar more-members">
                            +{group.members.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-footer bg-white border-top-0 pt-0">
                    <div className="d-flex justify-content-between gap-2">
                      <Link to={`/group-chat/${group.id}`} className="btn btn-primary flex-grow-1">
                        <i className="bi bi-chat-dots-fill me-2"></i>
                        Отвори разговор
                      </Link>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleLeaveGroup(group.id)}
                        title="Напушти ја групата"
                      >
                        <i className="bi bi-box-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center p-5 bg-light rounded-4 shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-4 text-primary">
              <i className="bi bi-chat-square-text" style={{ fontSize: '4rem' }}></i>
            </div>
            <h3 className="fw-bold mb-3">Нема пронајдени групи</h3>
            {searchTerm ? (
              <div>
                <p className="text-muted mb-4">
                  Нема групи што одговараат на вашето пребарување "{searchTerm}".
                </p>
                <button 
                  className="btn btn-outline-primary mb-3"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Исчисти го филтерот
                </button>
              </div>
            ) : (
              <div>
                <p className="text-muted mb-4 w-75 mx-auto">
                  Сè уште не сте член на ниту една група. Создадете нова група за да започнете разговор со неколку луѓе истовремено.
                </p>
                <div className="d-flex justify-content-center mt-4">
                  <Link to="/create-group" className="btn btn-primary btn-lg">
                    <i className="bi bi-plus-circle me-2"></i>
                    Создади нова група
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default GroupChatList;
