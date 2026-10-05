import React from 'react';
import PropTypes from 'prop-types';
import './Filters.css';

// Fix #11: Removed inline styles from date inputs — now handled by Filters.css with CSS variables
const Filters = ({ filters, onFilterChange }) => {
    const categories = ['All', 'Food', 'Travel', 'Rent', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Subscriptions', 'Salary', 'Freelance', 'Investments', 'Other'];

    return (
        <div className="filters-container">
            <div className="filter-group">
                <label>Category</label>
                <select value={filters.category} onChange={(e) => onFilterChange('category', e.target.value)}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="filter-group">
                <label>Type</label>
                <select value={filters.type} onChange={(e) => onFilterChange('type', e.target.value)}>
                    <option value="All">All</option>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
            </div>
            <div className="filter-group">
                <label>Sort By</label>
                <select value={filters.sortBy} onChange={(e) => onFilterChange('sortBy', e.target.value)}>
                    <option value="date-desc">Date (Newest)</option>
                    <option value="date-asc">Date (Oldest)</option>
                    <option value="amount-desc">Amount (Highest)</option>
                    <option value="amount-asc">Amount (Lowest)</option>
                    <option value="category-asc">Category (A-Z)</option>
                    <option value="category-desc">Category (Z-A)</option>
                </select>
            </div>

            <div className="filter-group">
                <label>From Date</label>
                <input type="date" value={filters.startDate || ''} onChange={(e) => onFilterChange('startDate', e.target.value)} />
            </div>
            <div className="filter-group">
                <label>To Date</label>
                <input type="date" value={filters.endDate || ''} onChange={(e) => onFilterChange('endDate', e.target.value)} />
            </div>
        </div>
    );
};

Filters.propTypes = {
    filters: PropTypes.shape({
        category: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        sortBy: PropTypes.string.isRequired,
        startDate: PropTypes.string,
        endDate: PropTypes.string
    }).isRequired,
    onFilterChange: PropTypes.func.isRequired
};

export default Filters;
