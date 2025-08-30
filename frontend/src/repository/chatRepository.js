import axios from '../axios/axios';

// Get chat partners
const chatRepository = {
  getChatPartners: async () => {
    const res = await axios.get('/api/chat/partners', { withCredentials: true });
    // Ensure the result is always an array
    if (Array.isArray(res.data)) {
      return res.data;
    } else if (res.data && Array.isArray(res.data.partners)) {
      return res.data.partners;
    } else {
      return [];
    }
  },
  getChatWith: async (username) => {
    const res = await axios.get(`/api/chat/messages/${username}`, { withCredentials: true });
    return res.data;
  },
  sendMessage: async (senderUsername, receiverUsername, content) => {
    await axios.post(`/api/chat/send/${receiverUsername}`, {
      sender: senderUsername,
      receiver: receiverUsername,
      content
    }, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
  }
};

export default chatRepository;
