import React, { useEffect, useState, useContext } from 'react';
import Navigation from '../Navigation';
import Footer from '../Footer';
import chatRepository from '../../repository/chatRepository';
import authContext from '../../contexts/authContext';
import userRepository from '../../repository/userRepository';

const Chat = () => {

  const { user } = useContext(authContext);
  const [partners, setPartners] = useState([]); // [{id, username, unreadCount}]
  const [selectedPartner, setSelectedPartner] = useState(null); // {id, username}
  const [messages, setMessages] = useState([]); // [{sender, receiver, content}]
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  // Helper to check if a user object matches the current user
  const isCurrentUser = (u, user) => {
    const props = [u.username, u.name, u.email, u.id, u._id, u.userId];
    return props.includes(user.username) || props.includes(user.name) || props.includes(user.email);
  };

  // Fetch chat partners on mount
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await chatRepository.getChatPartners();
        // Only exclude the logged-in user by id, fallback to username if id is not available
        let filtered = [];
        if (Array.isArray(data)) {
          if (user.id !== undefined && user.id !== null) {
            filtered = data.filter(u => u.id !== user.id);
          } else if (user.username) {
            filtered = data.filter(u => u.username !== user.username);
          } else {
            filtered = data;
          }
        }
        if (filtered.length === 0) {
          console.log('No partners found. Raw data:', data);
        }
        if (filtered.length > 0) {
          setPartners(filtered);
        } else {
          const allUsers = await userRepository.getAllUsers();
          if (user.id !== undefined && user.id !== null) {
            filtered = allUsers.filter(u => u.id !== user.id);
          } else if (user.username) {
            filtered = allUsers.filter(u => u.username !== user.username);
          } else {
            filtered = allUsers;
          }
          if (filtered.length === 0) {
            console.log('No partners found in allUsers. Raw data:', allUsers);
          }
          setPartners(filtered);
        }
      } catch (err) {
        try {
          const allUsers = await userRepository.getAllUsers();
          let filtered = [];
          if (user.id !== undefined && user.id !== null) {
            filtered = allUsers.filter(u => u.id !== user.id);
          } else if (user.username) {
            filtered = allUsers.filter(u => u.username !== user.username);
          } else {
            filtered = allUsers;
          }
          if (filtered.length === 0) {
            console.log('No partners found in allUsers (error fallback). Raw data:', allUsers);
          }
          setPartners(filtered);
        } catch {
          setPartners([]);
        }
      }
    };
    fetchPartners();
  }, [user]);

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
    setSendError('');
    if (!messageInput.trim() || !selectedPartner) return;
    setSending(true);
    try {
      // Use the correct property for sending messages
      const receiver = selectedPartner.username || selectedPartner.name || selectedPartner.email;
      await chatRepository.sendMessage(user.username, receiver, messageInput);
      const data = await chatRepository.getChatWith(receiver);
      setMessages(data.messages || []);
      setMessageInput('');
    } catch (err) {
      console.error('Send message error:', err?.response?.data || err);
      setSendError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">

      <main className="container flex-grow-1 py-4">
        <div className="row">
          {/* Chat partners list */}
          <div className="col-md-3 border-end">
            <h5>Chat Partners</h5>
            <ul className="list-group">
              {(Array.isArray(partners) ? partners : []).length === 0 ? (
                <li className="list-group-item text-muted">No other users available to chat.</li>
              ) : (
                (Array.isArray(partners) ? partners : []).map((partner) => (
                  <li
                    key={partner.id || partner._id || partner.userId || partner.email}
                    className={`list-group-item list-group-item-action${selectedPartner && (selectedPartner.id === partner.id || selectedPartner._id === partner._id || selectedPartner.userId === partner.userId || selectedPartner.email === partner.email) ? ' active' : ''}`}
                    onClick={() => setSelectedPartner(partner)}
                    style={{ cursor: 'pointer' }}
                  >
                    {partner.username || partner.name || partner.email}
                    {partner.unreadCount > 0 && (
                      <span className="badge bg-danger ms-2">{partner.unreadCount}</span>
                    )}
                  </li>
                ))
              )}
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
                  <button className="btn btn-primary" type="submit" disabled={sending}>
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </form>
                {sendError && <div className="text-danger mt-2">{sendError}</div>}
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
