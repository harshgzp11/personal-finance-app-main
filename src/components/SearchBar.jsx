import React from 'react';
import PropTypes from 'prop-types';
import { FiSearch } from 'react-icons/fi';
// Fix #12: SearchBar now imports its own dedicated CSS file
import './SearchBar.css';

const SearchBar = ({ value, onChange }) => {
    return (
        <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
                type="text"
                placeholder="Search transactions by title or notes..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

SearchBar.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default SearchBar;
