import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navigation from '../Navigation';
import Footer from '../Footer';
import groupChatRepository from '../../repository/groupChatRepository';
import userRepository from '../../repository/userRepository';
import './GroupChat.css';

const CreateGroupChat = () => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();

  // Handle search for users
  const handleSearchUsers = async () => {
    if (!searchTerm.trim()) return;
    
    setSearchLoading(true);
    try {
      console.log('Searching for users with term:', searchTerm);
      const results = await userRepository.searchUsers(searchTerm);
      console.log('Search results:', results);
      
      // Filter out users already added as members
      const filteredResults = results.filter(user => 
        !members.some(member => member.username === user.username)
      );
      setSearchResults(filteredResults);
      
      if (filteredResults.length === 0) {
        toast.info('Нема пронајдени корисници за: ' + searchTerm);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Грешка при пребарување на корисници: ' + error.message);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle adding a member
  const handleAddMember = (user) => {
    setMembers([...members, user]);
    setSearchResults(searchResults.filter(u => u.username !== user.username));
    setSearchTerm('');
  };

  // Handle removing a member
  const handleRemoveMember = (username) => {
    setMembers(members.filter(member => member.username !== username));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      toast.error('Ве молиме внесете име на групата');
      return;
    }
    
    // If no members selected, show warning but allow creation
    if (members.length === 0 && !window.confirm('Дали сте сигурни дека сакате да создадете група без членови?')) {
      return;
    }
    
    setLoading(true);
    try {
      // Create group chat
      const newGroup = await groupChatRepository.createGroupChat({
        name: groupName.trim(),
        description: groupDescription.trim(),
        memberIds: members.map(member => member.id)
      });
      
      toast.success('Групата е успешно создадена');
      navigate(`/group-chat/${newGroup.id}`);
    } catch (error) {
      console.error('Error creating group chat:', error);
      toast.error('Грешка при создавање на групата');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* <Navigation /> */}
      <main className="container flex-grow-1 py-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="create-group-form">
              <h2>Создај нова група</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="groupName" className="form-label">Име на групата *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Внесете име на групата"
                    required
                  />
                </div>
                
                <div className="form-group mb-3">
                  <label htmlFor="groupDescription" className="form-label">Опис (опционално)</label>
                  <textarea
                    className="form-control"
                    id="groupDescription"
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    placeholder="Краток опис на групата"
                    rows="3"
                  />
                </div>
                
                <div className="form-group mb-4">
                  <label className="form-label">Додади членови</label>
                  <div className="user-search-container">
                    <div className="user-search-input">
                      <i className="bi bi-search"></i>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Пребарај корисници по корисничко име"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyUp={(e) => e.key === 'Enter' && handleSearchUsers()}
                      />
                    </div>
                    <div className="d-grid mt-2">
                      <button 
                        className="btn btn-outline-primary" 
                        type="button"
                        onClick={handleSearchUsers}
                        disabled={searchLoading}
                      >
                        {searchLoading ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <><i className="bi bi-search me-2"></i>Пребарај</>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Search results */}
                  {searchResults.length > 0 && (
                    <div className="user-search-results">
                      <div className="p-2 bg-light">
                        <small>Резултати од пребарувањето</small>
                      </div>
                      <ul className="list-group list-group-flush">
                        {searchResults.map(user => (
                          <li key={user.id} className="search-result-item">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <div className="member-avatar me-2">
                                  {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span>{user.username}</span>
                              </div>
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => handleAddMember(user)}
                              >
                                <i className="bi bi-plus-lg me-1"></i>Додади
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Selected members */}
                  <div className="selected-members mt-4">
                    <h5>Избрани членови ({members.length})</h5>
                    {members.length > 0 ? (
                      <div>
                        {members.map(member => (
                          <div key={member.id} className="selected-member-item">
                            <div className="d-flex align-items-center">
                              <div className="member-avatar me-2">
                                {member.username.charAt(0).toUpperCase()}
                              </div>
                              <span>{member.username}</span>
                            </div>
                            <button
                              type="button"
                              className="btn"
                              onClick={() => handleRemoveMember(member.username)}
                            >
                              <i className="bi bi-x-circle"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted py-3">
                        <small>Нема избрани членови. Пребарајте и додадете членови погоре.</small>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                  >
                    <i className="bi bi-arrow-left me-1"></i>Откажи
                  </button>
                  <button
                    type="submit"
                    className="create-group-submit"
                    disabled={loading || !groupName.trim()}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Создавање...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-1"></i>Создај група
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateGroupChat;
