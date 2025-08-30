import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authContext from "../contexts/authContext";

const Navigation = () => {
    const { user, logout } = useContext(authContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    Student's Hub
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Почетна</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/event-posts">Настани</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/housing-posts">Сместување</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/internship-posts">Пракса</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/transport-posts">Превоз</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/material-posts">Материјали</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/tutor-posts">Тутори</Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/my-posts">Мои објави</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/chat">Chat</Link>
                                </li>
                                <li className="nav-item">
                                    <span className="nav-link">Добредојде, {user.username}</span>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                        Одјави се
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Најави се</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Регистрирај се</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;