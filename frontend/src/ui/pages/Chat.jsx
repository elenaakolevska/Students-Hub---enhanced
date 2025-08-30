import React, { useEffect, useState, useContext } from 'react';
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
        } catch (err) {
          setMessages([]);
        } finally {
          setLoading(false);
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
    } catch (err) {
      // Optionally handle error
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation />
      <main className="container flex-grow-1 py-4">
        <div className="row">
          {/* Chat partners list */}
          <div className="col-md-3 border-end">
            <h5>Chat Partners</h5>
            <ul className="list-group">
              {partners.map((partner) => (
                <li
                  key={partner.id}
                  className={`list-group-item list-group-item-action${selectedPartner && selectedPartner.id === partner.id ? ' active' : ''}`}
                  onClick={() => setSelectedPartner(partner)}
                  style={{ cursor: 'pointer' }}
                >
                  {partner.username}
                  {partner.unreadCount > 0 && (
                    <span className="badge bg-danger ms-2">{partner.unreadCount}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {/* Chat window */}
          <div className="col-md-9">
            <h5>Chat</h5>
            {selectedPartner ? (
              <>
                <div className="border rounded p-3 mb-3" style={{ height: 300, overflowY: 'auto', background: '#f8f9fa' }}>
                  {loading ? (
                    <div className="text-center text-muted">Loading...</div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div key={idx} className={msg.sender === user.username ? 'text-end' : 'text-start'}>
                        <span className={`badge ${msg.sender === user.username ? 'bg-primary' : 'bg-secondary'}`}>{msg.content}</span>
                      </div>
                    ))
                  )}
                </div>
                <form className="d-flex" onSubmit={handleSend}>
                  <input
                    className="form-control me-2"
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    disabled={loading}
                  />
                  <button className="btn btn-primary" type="submit" disabled={loading}>Send</button>
                </form>
              </>
            ) : (
              <div className="text-muted">Select a chat partner to start chatting.</div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
