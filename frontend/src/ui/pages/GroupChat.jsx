import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navigation from '../Navigation';
import Footer from '../Footer';
import groupChatRepository from '../../repository/groupChatRepository';
import userRepository from '../../repository/userRepository';
import './GroupChat.css';
import '../pages/Chat.css'; // Reuse some styles from the existing Chat component

const GroupChat = () => {
  const { groupId } = useParams();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [newMemberUsername, setNewMemberUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const messageContainerRef = useRef(null);
  const navigate = useNavigate();

  // Get current user from localStorage
  const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      return tokenData.sub; // username is stored in the 'sub' claim
    } catch (e) {
      return null;
    }
  };

  // Fetch user's group chats
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await groupChatRepository.getMyGroupChats();
        setGroups(data);
        
        if (groupId) {
          const selectedGroupData = data.find(g => g.id.toString() === groupId);
          if (selectedGroupData) {
            setSelectedGroup(selectedGroupData);
            setEditedName(selectedGroupData.name);
            setEditedDescription(selectedGroupData.description || '');
            
            // Check if user is admin
            const membershipCheck = await groupChatRepository.checkMembership(groupId);
            setIsAdmin(membershipCheck.isAdmin);
          }
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        toast.error('Грешка при вчитување на групите');
      }
    };
    
    fetchGroups();
  }, [groupId]);

  // Fetch messages when group selected
  useEffect(() => {
    if (!selectedGroup) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const data = await groupChatRepository.getGroupMessages(selectedGroup.id);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    };
    
    fetchMessages();
    
    // Set up polling for new messages
    const intervalId = setInterval(fetchMessages, 5000);
    
    return () => clearInterval(intervalId);
  }, [selectedGroup]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectGroup = async (group) => {
    setSelectedGroup(group);
    setEditedName(group.name);
    setEditedDescription(group.description || '');
    navigate(`/group-chat/${group.id}`);
    
    // Check if user is admin
    try {
      const membershipCheck = await groupChatRepository.checkMembership(group.id);
      setIsAdmin(membershipCheck.isAdmin);
    } catch (error) {
      console.error('Error checking membership:', error);
      setIsAdmin(false);
    }
  };

  // Handle sending message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedGroup) return;

    try {
      await groupChatRepository.sendGroupMessage(selectedGroup.id, messageInput);
      const messages = await groupChatRepository.getGroupMessages(selectedGroup.id);
      setMessages(messages);
      setMessageInput('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Грешка при испраќање на пораката');
    }
  };

  // Check if message is from current user
  const isSender = (message) => {
    const currentUser = getCurrentUser();
    return message.senderUsername === currentUser;
  };

  // Add member to group
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberUsername.trim() || !selectedGroup) return;

    try {
      console.log('Adding member:', newMemberUsername);
      await groupChatRepository.addMember(selectedGroup.id, newMemberUsername);
      toast.success(`Корисникот ${newMemberUsername} е додаден во групата`);
      
      // Refresh group data
      const updatedGroup = await groupChatRepository.getGroupChatById(selectedGroup.id);
      setSelectedGroup(updatedGroup);
      
      // Update groups list
      const updatedGroups = groups.map(g => 
        g.id === selectedGroup.id ? updatedGroup : g
      );
      setGroups(updatedGroups);
      
      setNewMemberUsername('');
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error(`Грешка при додавање на член: ${error.response?.data?.message || error.message}`);
    }
  };

  // Remove member from group
  const handleRemoveMember = async (username) => {
    if (!selectedGroup) return;

    try {
      await groupChatRepository.removeMember(selectedGroup.id, username);
      toast.success(`Корисникот ${username} е отстранет од групата`);
      
      // Refresh group data
      const updatedGroup = await groupChatRepository.getGroupChatById(selectedGroup.id);
      setSelectedGroup(updatedGroup);
      
      // Update groups list
      const updatedGroups = groups.map(g => 
        g.id === selectedGroup.id ? updatedGroup : g
      );
      setGroups(updatedGroups);
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Грешка при отстранување на член');
    }
  };

  // Update group details
  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    if (!editedName.trim() || !selectedGroup) return;

    try {
      const updatedGroup = await groupChatRepository.updateGroupChat(
        selectedGroup.id, 
        { name: editedName, description: editedDescription }
      );
      
      setSelectedGroup(updatedGroup);
      
      // Update groups list
      const updatedGroups = groups.map(g => 
        g.id === selectedGroup.id ? updatedGroup : g
      );
      setGroups(updatedGroups);
      
      setEditMode(false);
      toast.success('Групата е успешно ажурирана');
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error('Грешка при ажурирање на групата');
    }
  };

  // Delete group
  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;
    
    if (window.confirm('Дали сте сигурни дека сакате да ја избришете оваа група?')) {
      try {
        await groupChatRepository.deleteGroupChat(selectedGroup.id);
        
        // Remove from groups list
        const updatedGroups = groups.filter(g => g.id !== selectedGroup.id);
        setGroups(updatedGroups);
        
        // Navigate to first group or home
        if (updatedGroups.length > 0) {
          handleSelectGroup(updatedGroups[0]);
        } else {
          setSelectedGroup(null);
          navigate('/group-chat');
        }
        
        toast.success('Групата е успешно избришана');
      } catch (error) {
        console.error('Error deleting group:', error);
        toast.error('Грешка при бришење на групата');
      }
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* <Navigation /> */}
      <main className="container flex-grow-1 py-4">
        <h2 className="mb-4">Групни Разговори</h2>
        
        <div className="row">
          {/* Groups list */}
          <div className="col-md-3">
            <div className="groups-container">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Мои групи</h5>
                <Link to="/create-group" className="btn btn-primary btn-sm rounded-pill">
                  <i className="bi bi-plus-lg me-1"></i>Нова група
                </Link>
              </div>
              
              <div className="groups-list mb-3">
                {groups.length ? groups.map(group => (
                  <div
                    key={group.id}
                    className={`group-list-item ${selectedGroup?.id === group.id ? 'active' : ''}`}
                    onClick={() => handleSelectGroup(group)}
                  >
                    <div className="d-flex flex-column">
                      <span className="group-name">{group.name}</span>
                      {group.description && (
                        <small className="text-muted text-truncate" style={{maxWidth: '150px'}}>
                          {group.description}
                        </small>
                      )}
                    </div>
                    <span className="group-members-badge">
                      <i className="bi bi-people-fill me-1"></i>
                      {group.members?.length || 0}
                    </span>
                  </div>
                )) : (
                  <div className="p-3 text-center text-muted">
                    Нема групни разговори
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div className="col-md-9">
            {selectedGroup ? (
                            <div className="group-chat-container">
                <div className="group-header">
                  {!editMode ? (
                    <div className="group-info">
                      <span className="group-name">{selectedGroup.name}</span>
                      {selectedGroup.description && (
                        <span className="group-description">{selectedGroup.description}</span>
                      )}
                    </div>
                  ) : (
                    <div className="w-100">
                      <div className="mb-2">
                        <input
                          type="text"
                          className="form-control"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          placeholder="Име на групата"
                          required
                        />
                      </div>
                      <div>
                        <textarea
                          className="form-control"
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          placeholder="Опис (опционално)"
                          rows="2"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="group-actions">
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setMembersOpen(!membersOpen)}
                    >
                      <i className="bi bi-people me-1"></i>
                      Членови
                      <span className="ms-1 badge bg-secondary">{selectedGroup.members?.length || 0}</span>
                    </button>
                    
                    {isAdmin && (
                      <>
                        {!editMode ? (
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setEditMode(true)}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Измени
                          </button>
                        ) : (
                          <>
                            <button 
                              className="btn btn-sm btn-outline-success"
                              onClick={handleUpdateGroup}
                            >
                              <i className="bi bi-check-lg me-1"></i>
                              Зачувај
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => {
                                setEditMode(false);
                                setEditedName(selectedGroup.name);
                                setEditedDescription(selectedGroup.description || '');
                              }}
                            >
                              <i className="bi bi-x-lg me-1"></i>
                              Откажи
                            </button>
                          </>
                        )}
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={handleDeleteGroup}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Избриши
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {membersOpen && (
                  <div className="p-3 border-bottom">
                    <h6 className="mb-3 d-flex align-items-center">
                      <i className="bi bi-people-fill me-2"></i>
                      Членови на групата
                    </h6>
                    
                    {isAdmin && (
                      <form className="add-member-form" onSubmit={handleAddMember}>
                        <div className="user-search-input mb-2">
                          <i className="bi bi-search"></i>
                          <input
                            type="text"
                            className="form-control"
                            value={newMemberUsername}
                            onChange={(e) => setNewMemberUsername(e.target.value)}
                            placeholder="Корисничко име"
                            required
                          />
                        </div>
                        <div className="d-grid">
                          <button type="submit" className="btn btn-primary">
                            <i className="bi bi-plus-lg me-1"></i>Додади член
                          </button>
                        </div>
                      </form>
                    )}
                    
                    <div className="member-list">
                      {selectedGroup.members?.map(member => (
                        <div key={member.id} className="member-item">
                          <div className="member-info">
                            <div className="member-avatar">
                              {member.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="member-username">{member.username}</span>
                              {member.username === selectedGroup.createdBy.username && (
                                <span className="admin-badge">
                                  <i className="bi bi-star-fill me-1"></i>Admin
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {isAdmin && member.username !== getCurrentUser() && (
                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill"
                              onClick={() => handleRemoveMember(member.username)}
                            >
                              <i className="bi bi-person-dash me-1"></i>Отстрани
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messageContainerRef} className="messages-container">
                  {loading ? (
                    <div className="text-center text-muted p-4">Вчитување...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-muted p-4">
                      Нема пораки. Започнете разговор!
                    </div>
                  ) : (
                    messages.map((message, idx) => {
                      const isSent = isSender(message);
                      
                      return (
                        <div key={idx} className={`message ${isSent ? 'sent' : 'received'}`}>
                          <div className="message-content">
                            {message.content}
                          </div>
                          <div className="message-meta">
                            <span className="message-sender">{message.senderUsername}</span>
                            <span className="message-time">
                              {new Date(message.timestamp).toLocaleTimeString('mk-MK', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="message-input-container">
                  <form onSubmit={handleSend} className="d-flex">
                    <div className="input-group">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Напиши порака..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        disabled={loading}
                      />
                      <button
                        className="btn"
                        type="submit"
                        disabled={loading || !messageInput.trim()}
                      >
                        <i className="bi bi-send"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100 p-5 bg-light rounded">
                <div className="text-center">
                  <div className="mb-3">
                    <i className="bi bi-chat-dots-fill text-primary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h4 className="mb-3">Добредојдовте во групните разговори</h4>
                  <p className="text-muted mb-4">
                    Изберете група од листата или создадете нова група за да започнете разговор.
                  </p>
                  <Link to="/create-group" className="btn btn-primary rounded-pill">
                    <i className="bi bi-plus-circle me-2"></i>
                    Создади нова група
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GroupChat;
