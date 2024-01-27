import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/components/_main_nav.scss';
import LogoutButton from "./LogoutButton";

const NavigationBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [includeAdult, setIncludeAdult] = useState(false);
    const [primaryReleaseDate, setPrimaryReleaseDate] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === '/login' || location.pathname === '/') {
        return null;
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleIncludeAdultChange = () => {
        setIncludeAdult(!includeAdult);
    };

    const handlePrimaryReleaseDateChange = (e) => {
        setPrimaryReleaseDate(e.target.value);
    };

    const validatePrimaryReleaseDate = (value) => {
        return /^\d{4}$/.test(value);
    };

    const validateForm = () => {
        if (!searchTerm.trim()) {
            setError("Search term cannot be empty");
            return false;
        }

        if (primaryReleaseDate && !validatePrimaryReleaseDate(primaryReleaseDate)) {
            setError("Please enter a valid year (YYYY)");
            return false;
        }

        return true;
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setError('');
        navigate(`/search?query=${searchTerm}&includeAdult=${includeAdult}&primaryReleaseDate=${primaryReleaseDate}`);
        setSearchTerm('');
        setIncludeAdult(false);
        setPrimaryReleaseDate('');
    };

    return (
        <header className="navigation-bar">
            <div className="logo">
                <Link to="/movies/popular"><img src={require('../filmFolio.png')} alt="FilmFolio Logo"/></Link>
            </div>
            <div className="menu-items">
                <nav>
                    <ul>
                        <li className="dropdown">
                            <span>Movies</span>
                            <ul className="dropdown-content">
                                <li><Link to="/movies/popular">Popular Movies</Link></li>
                                <li><Link to="/movies/custom">Custom Movies</Link></li>
                                <li><Link to="/movies/discover">Discover</Link></li>
                            </ul>
                        </li>
                        <li className="search-item">
                            <span>Search</span>
                            <form onSubmit={handleSearchSubmit} className="dropdown-content search-form">
                                {error && <div className="error">{error}</div>}
                                <input type="text" placeholder="Search" value={searchTerm}
                                       onChange={handleSearchChange}/>
                                <input type="text" placeholder="Year" value={primaryReleaseDate}
                                       onChange={handlePrimaryReleaseDateChange}/>
                                <label><input type="checkbox" checked={includeAdult}
                                              onChange={handleIncludeAdultChange}/> Include Adult</label>
                                <button className="button" type="submit">Search</button>
                            </form>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="profile">
                <Link to="/profile">Profile</Link>
            </div>
            <div className="logout">
                <LogoutButton/>
            </div>
        </header>
    );
};

export default NavigationBar;
