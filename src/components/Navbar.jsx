import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
// Fix #9: Changed "/" to "/dashboard" so the NavLink correctly shows active state
import { FiHome, FiList, FiPieChart, FiTarget, FiPlusCircle, FiSun, FiMoon } from 'react-icons/fi';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme }) => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h2>Finance<span>Pro</span></h2>
            </div>
            <ul className="navbar-links">
                <li><NavLink to="/dashboard"><FiHome /> Dashboard</NavLink></li>
                <li><NavLink to="/transactions"><FiList /> Transactions</NavLink></li>
                <li><NavLink to="/budget"><FiTarget /> Budget</NavLink></li>
                <li><NavLink to="/analytics"><FiPieChart /> Analytics</NavLink></li>
            </ul>
            <div className="navbar-actions">
                <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
                    {theme === 'dark' ? <FiSun /> : <FiMoon />}
                </button>
                <NavLink to="/transactions/new" className="btn-primary">
                    <FiPlusCircle /> Add Transaction
                </NavLink>
            </div>
        </nav>
    );
};

Navbar.propTypes = {
    theme: PropTypes.string.isRequired,
    toggleTheme: PropTypes.func.isRequired
};

export default Navbar;
