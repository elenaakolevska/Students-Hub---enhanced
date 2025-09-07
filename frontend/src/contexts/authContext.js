import { createContext } from 'react';

const authContext = createContext({
    user: null,
    isAuthenticated: false,
    loading: true,
    login: () => {},
    logout: () => {},
    checkAuth: () => {}
});

export default authContext;
