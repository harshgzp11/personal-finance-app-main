import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
// Fix #9: Changed "/" to "/dashboard" so the NavLink correctly shows active state
import { FiHome, FiList, FiPieChart, FiTarget, FiPlusCircle, FiSun, FiMoon, FiAward, FiSearch } from 'react-icons/fi';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme, onOpenCommandPalette }) => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h2>Finance<span>Pro</span></h2>
            </div>
            <ul className="navbar-links">
                <li><NavLink to="/dashboard"><FiHome /> Dashboard</NavLink></li>
                <li><NavLink to="/transactions"><FiList /> Transactions</NavLink></li>
                <li><NavLink to="/budget"><FiTarget /> Budget</NavLink></li>
                <li><NavLink to="/goals"><FiAward /> Goals</NavLink></li>
                <li><NavLink to="/analytics"><FiPieChart /> Analytics</NavLink></li>
            </ul>
            <div className="navbar-actions">
                <button
                    className="cmd-trigger-btn"
                    onClick={onOpenCommandPalette}
                    title="Quick Command Palette (Ctrl+K)"
                    aria-label="Quick Command Palette"
                >
                    <FiSearch />
                    <span className="cmd-kbd-hint">Ctrl K</span>
                </button>
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
    toggleTheme: PropTypes.func.isRequired,
    onOpenCommandPalette: PropTypes.func
};

export default Navbar;
