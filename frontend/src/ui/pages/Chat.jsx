import React, { useEffect, useState, useContext, useRef } from 'react';
import Navigation from '../Navigation';
import Footer from '../Footer';
import chatRepository from '../../repository/chatRepository';
import authContext from '../../contexts/authContext';

const Chat = () => {

  const { user } = useContext(authContext);
  const [partners, setPartners] = useState([]); // [{id, username, unreadCount}]
  const [selectedPartner, setSelectedPartner] = useState(null); // {id, username}
  const [messages, setMessages] = useState([]); // [{sender, receiver, content}]
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messageContainerRef = useRef(null);

  // Fetch chat partners on mount
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await chatRepository.getChatPartners();
        setPartners(data);
      } catch (err) {
        setPartners([]);
      }
    };
    fetchPartners();
  }, []);

  // Fetch messages when a partner is selected
  useEffect(() => {
    if (selectedPartner) {
      const fetchMessages = async () => {
        setLoading(true);
        try {
          const data = await chatRepository.getChatWith(selectedPartner.username);
          setMessages(data.messages || []);
          
          // Update the unread count in partners list
          setPartners(prevPartners => 
            prevPartners.map(p => 
              p.id === selectedPartner.id ? {...p, unreadCount: 0} : p
            )
          );
        } catch (err) {
          setMessages([]);
        } finally {
          setLoading(false);
          // Scroll to bottom after messages load
          if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
          }
        }
      };
      fetchMessages();
    }
  }, [selectedPartner]);

  // Handle sending a message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedPartner) return;
    try {
      await chatRepository.sendMessage(selectedPartner.username, messageInput);
      // Refresh messages after sending
      const data = await chatRepository.getChatWith(selectedPartner.username);
      setMessages(data.messages || []);
      setMessageInput('');
      // Scroll to bottom after sending
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="container flex-grow-1 py-4">
        <div className="row">
          {/* Chat partners list */}
          <div className="col-md-3 border-end">
            <h5 className="mb-3">Conversations</h5>
            <ul className="list-group">
              {partners.length > 0 ? partners.map((partner) => (
                <li
                  key={partner.id}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center${selectedPartner && selectedPartner.id === partner.id ? ' active' : ''}`}
                  onClick={() => setSelectedPartner(partner)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center">
                    <div className="avatar-placeholder me-2" style={{ width: 32, height: 32, borderRadius: '50%', background: '#e9ecef', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {partner.username.charAt(0).toUpperCase()}
                    </div>
                    <span>{partner.username}</span>
                  </div>
                  {partner.unreadCount > 0 && (
                    <span className="badge rounded-pill bg-danger">{partner.unreadCount}</span>
                  )}
                </li>
              )) : (
                <li className="list-group-item text-center text-muted">No conversations yet</li>
              )}
            </ul>
          </div>
          
          {/* Chat window - Styled after the HTML template */}
          <div className="col-md-9">
            {selectedPartner ? (
              <div className="card shadow-sm" style={{ height: '75vh', display: 'flex', flexDirection: 'column' }}>
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0 d-flex align-items-center">
                    <div className="avatar-placeholder me-2" style={{ width: 32, height: 32, borderRadius: '50%', background: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#0084ff' }}>
                      {selectedPartner.username.charAt(0).toUpperCase()}
                    </div>
                    <span>{selectedPartner.username}</span>
                  </h5>
                </div>
                
                {/* Message container - using same style as HTML template */}
                <div 
                  ref={messageContainerRef}
                  className="card-body p-3" 
                  style={{ 
                    flexGrow: 1, 
                    overflowY: 'auto', 
                    background: '#e5ddd5', 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <style>
                    {`
                      .message {
                        max-width: 75%;
                        padding: 12px 16px;
                        border-radius: 20px;
                        position: relative;
                        word-wrap: break-word;
                      }
                      .message.sender {
                        align-self: flex-end;
                        background-color: #0084ff;
                        color: white;
                        border-bottom-right-radius: 0;
                      }
                      .message.receiver {
                        align-self: flex-start;
                        background-color: white;
                        color: #333;
                        border-bottom-left-radius: 0;
                      }
                      .username {
                        font-weight: 600;
                        margin-bottom: 6px;
                        font-size: 0.85rem;
                        opacity: 0.8;
                      }
                    `}
                  </style>
                  {loading ? (
                    <div className="text-center text-muted">Loading...</div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`message ${msg.sender === user.username ? 'sender' : 'receiver'}`}
                      >
                        <div className="username">{msg.sender}</div>
                        <div>{msg.content}</div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Chat input area - match the HTML template */}
                <div className="card-footer border-top p-2 bg-white" style={{ display: 'flex', gap: '10px' }}>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                    style={{
                      borderRadius: '20px',
                      padding: '10px 15px',
                      fontSize: '1rem'
                    }}
                  />
                  <button 
                    className="btn"
                    type="button"
                    onClick={handleSend}
                    disabled={loading || !messageInput.trim()}
                    style={{
                      backgroundColor: '#0084ff',
                      color: 'white',
                      borderRadius: '20px',
                      border: 'none',
                      padding: '10px 20px',
                      fontWeight: 600
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                <p>Select a chat partner to start chatting.</p>
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
