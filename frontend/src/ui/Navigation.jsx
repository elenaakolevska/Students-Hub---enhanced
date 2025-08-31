import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authContext from "../contexts/authContext";

const Navigation = () => {
    const { user, logout } = useContext(authContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Check if a link is active
    const isActive = (path) => location.pathname === path ? 'active' : '';

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow">
            <div className="container">
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                    <i className="bi bi-mortarboard-fill me-2"></i>
                    Student's Hub
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* Main navigation links */}
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/event-posts')}`} to="/event-posts">
                                <i className="bi bi-calendar-event me-1"></i>Настани
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/housing-posts')}`} to="/housing-posts">
                                <i className="bi bi-house me-1"></i>Сместување
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/internship-posts')}`} to="/internship-posts">
                                <i className="bi bi-briefcase me-1"></i>Пракса
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/transport-posts')}`} to="/transport-posts">
                                <i className="bi bi-car-front me-1"></i>Превоз
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/material-posts')}`} to="/material-posts">
                                <i className="bi bi-book me-1"></i>Материјали
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/tutor-posts')}`} to="/tutor-posts">
                                <i className="bi bi-person-video3 me-1"></i>Тутори
                            </Link>
                        </li>
                    </ul>

                    {/* User-related links */}
                    <ul className="navbar-nav">
                        {user ? (
                            <>
                                <li className="nav-item dropdown" ref={dropdownRef}>
                                    <a 
                                        className={`nav-link dropdown-toggle ${isDropdownOpen ? 'show' : ''}`} 
                                        href="#" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleDropdown();
                                        }}
                                    >
                                        <i className="bi bi-person-circle me-1"></i>
                                        {user.username || 'Корисник'}
                                    </a>
                                    <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`} style={{
                                        display: isDropdownOpen ? 'block' : 'none',
                                        position: 'absolute'
                                    }}>
                                        <li>
                                            <Link className="dropdown-item" to="/my-posts" onClick={() => setIsDropdownOpen(false)}>
                                                <i className="bi bi-file-earmark-text me-2"></i>Мои објави
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/favorites" onClick={() => setIsDropdownOpen(false)}>
                                                <i className="bi bi-star me-2"></i>Омилени
                                            </Link>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button className="dropdown-item text-danger" onClick={handleLogout}>
                                                <i className="bi bi-box-arrow-right me-2"></i>Одјави се
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive('/chat')}`} to="/chat">
                                        <i className="bi bi-chat-dots-fill me-1"></i>Чат
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="btn btn-outline-light ms-2" to="/login">
                                        <i className="bi bi-box-arrow-in-right me-1"></i>Најави се
                                    </Link>
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
