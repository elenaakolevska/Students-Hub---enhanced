import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authContext from "../contexts/authContext";

const Navigation = () => {
    const { user, isAuthenticated, logout } = useContext(authContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

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
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/')}`} to="/">
                                <i className="bi bi-house-door me-1"></i>Дома
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/materials')}`} to="/materials">
                                <i className="bi bi-file-earmark-text me-1"></i>Материјали
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/events')}`} to="/events">
                                <i className="bi bi-calendar-event me-1"></i>Настани
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/tutors')}`} to="/tutors">
                                <i className="bi bi-mortarboard me-1"></i>Тутори
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/housing')}`} to="/housing">
                                <i className="bi bi-house-door me-1"></i>Домување
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/internships')}`} to="/internships">
                                <i className="bi bi-briefcase me-1"></i>Пракси
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/transport')}`} to="/transport">
                                <i className="bi bi-car-front me-1"></i>Превоз
                            </Link>
                        </li>

                        {isAuthenticated && (
                            <>
                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive('/chat')}`} to="/chat">
                                        <i className="bi bi-chat-dots me-1"></i>Чет
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive('/favorites')}`} to="/favorites">
                                        <i className="bi bi-heart me-1"></i>Омилени
                                    </Link>
                                </li>
                            </>
                        )}

                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/about')}`} to="/about">
                                <i className="bi bi-info-circle me-1"></i>За нас
                            </Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav">
                        {isAuthenticated ? (
                            <li className="nav-item dropdown" ref={dropdownRef}>
                                <button
                                    className="nav-link dropdown-toggle border-0 bg-transparent text-white"
                                    onClick={toggleDropdown}
                                    aria-expanded={isDropdownOpen}
                                >
                                    <i className="bi bi-person-circle me-1"></i>
                                    {user?.sub || user?.username || 'Корисник'}
                                </button>
                                <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`}>
                                    <li>
                                        <Link className="dropdown-item" to="/my-posts">
                                            <i className="bi bi-file-post me-2"></i>Мои објави
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/favorites">
                                            <i className="bi bi-heart me-2"></i>Омилени
                                        </Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            <i className="bi bi-box-arrow-right me-2"></i>Одјавете се
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        <i className="bi bi-box-arrow-in-right me-1"></i>Најавете се
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">
                                        <i className="bi bi-person-plus me-1"></i>Регистрирајте се
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
