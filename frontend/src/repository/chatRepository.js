import axios from '../axios/axios';

// Get chat partners
const chatRepository = {
  getChatPartners: async () => {
    const res = await axios.get('/api/chat/partners', { withCredentials: true });
    return res.data;
  },
  getChatWith: async (username) => {
    const res = await axios.get(`/api/chat/messages/${username}`, { withCredentials: true });
    return res.data;
  },
  sendMessage: async (receiverUsername, content) => {
    await axios.post(`/api/chat/send/${receiverUsername}`, content, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
  }
};

export default chatRepository;
