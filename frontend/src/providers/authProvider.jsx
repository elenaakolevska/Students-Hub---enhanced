import React, { useState, useEffect } from 'react';
import authContext from '../contexts/authContext';
import authService from '../services/authService';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            setLoading(true);
            const token = authService.getToken();

            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }

            if (!authService.isAuthenticated()) {
                authService.logout();
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }

            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);
            } else {
                const authCheck = await authService.checkAuth();
                if (authCheck.authenticated) {
                    setUser({ sub: authCheck.username });
                    setIsAuthenticated(true);
                } else {
                    authService.logout();
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            authService.logout();
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            setUser(response.user || { sub: response.username });
            setIsAuthenticated(true);
            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuth
    };

    return (
        <authContext.Provider value={value}>
            {children}
        </authContext.Provider>
    );
};

export default AuthProvider;
