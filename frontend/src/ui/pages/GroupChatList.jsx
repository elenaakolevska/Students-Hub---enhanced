import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navigation from '../Navigation';
import Footer from '../Footer';
import groupChatRepository from '../../repository/groupChatRepository';
import './GroupChat.css';

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
        <div className="row mb-4">
          <div className="col-md-8">
            <h2>Мои Групни Разговори</h2>
          </div>
          <div className="col-md-4 text-end">
            <Link to="/create-group" className="btn btn-primary">
              + Создади нова група
            </Link>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Пребарај групи..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-outline-secondary" type="button">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Вчитување...</span>
            </div>
            <p className="mt-2">Вчитување на групи...</p>
          </div>
        ) : filteredGroups.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredGroups.map(group => (
              <div key={group.id} className="col">
                <div className="card h-100 group-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title mb-0">{group.name}</h5>
                      <span className="badge bg-primary rounded-pill">
                        {group.members?.length || 0} членови
                      </span>
                    </div>
                    
                    {group.description && (
                      <p className="card-text text-muted group-description-preview">
                        {group.description}
                      </p>
                    )}
                    
                    <p className="card-text">
                      <small className="text-muted">
                        Создадена од: {group.createdBy?.username || 'Непознато'}
                      </small>
                    </p>
                    
                    <div className="group-members-preview">
                      <small className="text-muted mb-2 d-block">Членови:</small>
                      <div className="member-avatars">
                        {group.members?.slice(0, 5).map(member => (
                          <div key={member.id} className="member-avatar" title={member.username}>
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
                  
                  <div className="card-footer bg-white border-top-0">
                    <div className="d-flex justify-content-between">
                      <Link to={`/group-chat/${group.id}`} className="btn btn-primary">
                        Отвори разговор
                      </Link>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleLeaveGroup(group.id)}
                      >
                        Напушти
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-5 bg-light rounded">
            <div className="mb-4">
              <i className="bi bi-chat-square-text" style={{ fontSize: '3rem' }}></i>
            </div>
            <h4>Нема пронајдени групи</h4>
            {searchTerm ? (
              <p className="text-muted">
                Нема групи што одговараат на вашето пребарување "{searchTerm}".
              </p>
            ) : (
              <p className="text-muted">
                Сè уште не сте член на ниту една група. Создадете нова група или побарајте покана од друг корисник.
              </p>
            )}
            <Link to="/create-group" className="btn btn-primary mt-3">
              Создади нова група
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default GroupChatList;
