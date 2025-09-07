import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../Navigation';
import Footer from '../Footer';
import chatRepository from '../../repository/chatRepository';
import './Chat.css';

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
      <Navigation />
      <main className="container flex-grow-1 py-4">
        <div className="row">
          {/* Partners */}
          <div className="col-md-3 border-end">
            <h5 className="mb-3">Разговори</h5>
            <ul className="list-group">
              {partners.length ? partners.map(p => (
                <li
                  key={p.id}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center${selectedPartner?.id === p.id ? ' active' : ''}`}
                  onClick={() => setSelectedPartner(p)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center">
                    <div className="avatar-placeholder me-2">{p.username.charAt(0).toUpperCase()}</div>
                    <span>{p.username}</span>
                  </div>
                  {p.unreadCount > 0 && (
                    <span className="badge rounded-pill bg-danger">{p.unreadCount}</span>
                  )}
                </li>
              )) : (
                <li className="list-group-item text-center text-muted">Нема разговори</li>
              )}
            </ul>
          </div>

          {/* Chat */}
          <div className="col-md-9">
            {selectedPartner ? (
              <div className="card shadow-sm chat-card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0 d-flex align-items-center">
                    <div className="avatar-placeholder me-2">
                      {selectedPartner.username.charAt(0).toUpperCase()}
                    </div>
                    <span>{selectedPartner.username}</span>
                  </h5>
                </div>

                <div ref={messageContainerRef} className="chat-body">
                  {loading ? (
                    <div className="text-center text-muted">Вчитување...</div>
                  ) : (
                    messages.map((message, idx) => {
                      const messageClass = isSender(message) ? 'sender' : 'receiver';
                      const content = message.content.startsWith('"') ?
                        JSON.parse(message.content) :
                        message.content;

                      return (
                        <div key={idx} className="message-wrapper">
                          <div className={`message ${messageClass}`}>
                            <div className="username">{message.senderUsername}</div>
                            <div>{content}</div>
                            <div className="timestamp">
                              {new Date(message.timestamp).toLocaleTimeString('mk-MK', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="card-footer chat-input">
                  <form onSubmit={handleSend} className="d-flex">
                    <input
                      className="form-control me-2"
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
                      Прати
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                <p>Изберете партнер за разговор.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
