import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../Navigation';
import Footer from '../Footer';
import chatRepository from '../../repository/chatRepository';
import './Chat.css';
import './GroupChat.css';

const Chat = () => {
  const { username } = useParams();
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messageContainerRef = useRef(null);

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

  // Fetch chat partners
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await chatRepository.getChatPartners();
        setPartners(data);

        if (username) {
          const targetPartner = data.find(p => p.username === username) || {
            username,
            id: username,
            unreadCount: 0
          };
          setSelectedPartner(targetPartner);

          if (!data.find(p => p.username === username)) {
            setPartners(prev => [...prev, targetPartner]);
          }
        }
      } catch {
        setPartners([]);
        if (username) {
          const targetPartner = {
            username,
            id: username,
            unreadCount: 0
          };
          setSelectedPartner(targetPartner);
          setPartners([targetPartner]);
        }
      }
    };
    fetchPartners();
  }, [username]);

  // Fetch messages when partner selected
  useEffect(() => {
    if (!selectedPartner) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const data = await chatRepository.getChatWith(selectedPartner.username);
        setMessages(data.messages || []);
        setPartners(prev =>
          prev.map(p =>
            p.id === selectedPartner.id ? { ...p, unreadCount: 0 } : p
          )
        );
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    };
    fetchMessages();
  }, [selectedPartner]);

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

  // Handle sending message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedPartner) return;

    try {
      const cleanMessage = messageInput.replace(/^"|"$/g, '');
      await chatRepository.sendMessage(selectedPartner.username, cleanMessage);
      const data = await chatRepository.getChatWith(selectedPartner.username);
      setMessages(data.messages || []);
      setMessageInput('');
      scrollToBottom();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Check if message is from current user
  const isSender = (message) => {
    const currentUser = getCurrentUser();
    return message.senderUsername === currentUser;
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="container flex-grow-1 py-4">
        <div className="groups-container">
          <h2 className="mb-4">Приватни разговори</h2>
          
          <div className="row">
            {/* Partners List */}
            <div className="col-lg-3 col-md-4">
              <div className="card shadow-sm mb-4 mb-md-0">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Контакти</h5>
                </div>
                <div className="groups-list">
                  {partners.length ? partners.map(p => (
                    <div
                      key={p.id}
                      className={`group-list-item ${selectedPartner?.id === p.id ? 'active' : ''}`}
                      onClick={() => setSelectedPartner(p)}
                    >
                      <div className="d-flex align-items-center">
                        <div className="member-avatar me-2">
                          {p.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="fw-medium">{p.username}</span>
                      </div>
                      {p.unreadCount > 0 && (
                        <span className="badge rounded-pill bg-danger">{p.unreadCount}</span>
                      )}
                    </div>
                  )) : (
                    <div className="group-list-item text-center text-muted">Нема разговори</div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="col-lg-9 col-md-8">
              {selectedPartner ? (
                <div className="group-chat-container">
                  <div className="group-header">
                    <div className="group-info">
                      <div className="d-flex align-items-center">
                        <div className="member-avatar me-2">
                          {selectedPartner.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="group-name">{selectedPartner.username}</span>
                      </div>
                    </div>
                  </div>

                  <div ref={messageContainerRef} className="messages-container">
                    {loading ? (
                      <div className="text-center text-muted p-4">
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Вчитување...</span>
                        </div>
                        Вчитување на пораки...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-muted p-4">
                        <i className="bi bi-chat-left-dots mb-3" style={{ fontSize: '2rem' }}></i>
                        <p>Нема пораки. Започнете разговор!</p>
                      </div>
                    ) : (
                      messages.map((message, idx) => {
                        const messageType = isSender(message) ? 'sent' : 'received';
                        const content = message.content.startsWith('"') ?
                          JSON.parse(message.content) :
                          message.content;

                        return (
                          <div key={idx} className={`message ${messageType}`}>
                            <div className="message-content">
                              {content}
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
                          className="btn btn-primary"
                          type="submit"
                          disabled={loading || !messageInput.trim()}
                        >
                          <i className="bi bi-send-fill"></i> Прати
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="text-center p-5 bg-light rounded">
                  <div className="mb-4">
                    <i className="bi bi-chat-dots" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h4>Изберете разговор</h4>
                  <p className="text-muted">
                    Изберете контакт од левата страна за да започнете или продолжите разговор.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
