import axios from '../axios/axios';

const groupChatRepository = {
  getMyGroupChats: async () => {
    const res = await axios.get('/api/group-chats', { withCredentials: true });
    return res.data;
  },
  
  getGroupChatById: async (id) => {
    const res = await axios.get(`/api/group-chats/${id}`, { withCredentials: true });
    return res.data;
  },
  
  getGroupMessages: async (id) => {
    const res = await axios.get(`/api/group-chats/${id}/messages`, { withCredentials: true });
    return res.data;
  },
  
  sendGroupMessage: async (groupId, content) => {
    const res = await axios.post(`/api/group-chats/${groupId}/messages`, 
      { content }, 
      { 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return res.data;
  },
  
  createGroupChat: async (groupData) => {
    const res = await axios.post('/api/group-chats', 
      groupData, 
      { 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return res.data;
  },
  
  updateGroupChat: async (groupId, groupData) => {
    const res = await axios.put(`/api/group-chats/${groupId}`, 
      groupData, 
      { 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return res.data;
  },
  
  addMember: async (groupId, username, isAdmin = false) => {
    const res = await axios.post(`/api/group-chats/${groupId}/members`, 
      { username, isAdmin }, 
      { 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return res.data;
  },
  
  removeMember: async (groupId, username) => {
    const res = await axios.delete(`/api/group-chats/${groupId}/members/${username}`, 
      { withCredentials: true }
    );
    return res.data;
  },
  
  deleteGroupChat: async (groupId) => {
    const res = await axios.delete(`/api/group-chats/${groupId}`, 
      { withCredentials: true }
    );
    return res.data;
  },
  
  checkMembership: async (groupId) => {
    const res = await axios.get(`/api/group-chats/${groupId}/members/check`, 
      { withCredentials: true }
    );
    return res.data;
  }
};

export default groupChatRepository;
