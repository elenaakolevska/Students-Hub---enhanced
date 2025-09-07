import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import authContext from '../../../contexts/authContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(authContext);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
