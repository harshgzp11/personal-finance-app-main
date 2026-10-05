import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import TransactionCard from '../components/TransactionCard';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './Pages.css';

const Transactions = () => {
    const { transactions, deleteTransaction } = useTransactions();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    const [filters, setFilters] = useState({
        category: 'All',
        type: 'All',
        sortBy: 'date-desc',
        startDate: '',
        endDate: ''
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleDelete = (id) => {
        deleteTransaction(id);
        toast.success("Transaction deleted!");
    };

    const handleEdit = (transaction) => {
        navigate(`/transactions/new?edit=${transaction.id}`);
    };

    let filteredTransactions = [...transactions];

    // Search Filtering
    if (debouncedSearch) {
        const lowerQuery = debouncedSearch.toLowerCase();
        filteredTransactions = filteredTransactions.filter(t =>
            t.title.toLowerCase().includes(lowerQuery) ||
            (t.notes && t.notes.toLowerCase().includes(lowerQuery))
        );
    }

    // Dropdown Filters
    if (filters.category !== 'All') {
        filteredTransactions = filteredTransactions.filter(t => t.category === filters.category);
    }
    if (filters.type !== 'All') {
        filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
    }

    // Fix #3: Date Range Filter — use proper Date comparison instead of string comparison
    // This handles ISO timestamps vs YYYY-MM-DD strings correctly across timezones
    if (filters.startDate) {
        const start = new Date(filters.startDate);
        start.setHours(0, 0, 0, 0);
        filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= start);
    }
    if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999); // include the full end day
        filteredTransactions = filteredTransactions.filter(t => new Date(t.date) <= end);
    }

    // Sorting
    filteredTransactions.sort((a, b) => {
        if (filters.sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (filters.sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (filters.sortBy === 'amount-desc') return b.amount - a.amount;
        if (filters.sortBy === 'amount-asc') return a.amount - b.amount;
        if (filters.sortBy === 'category-asc') return a.category.localeCompare(b.category);
        if (filters.sortBy === 'category-desc') return b.category.localeCompare(a.category);
        return 0;
    });

    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
        >
            <header className="page-header">
                <h1>All Transactions</h1>
                <p>Manage and filter your income and expenses.</p>
            </header>

            <div className="search-filter-card">
                <SearchBar value={search} onChange={setSearch} />
                <Filters filters={filters} onFilterChange={handleFilterChange} />
            </div>

            <div className="transactions-list">
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(t => (
                        <TransactionCard
                            key={t.id}
                            transaction={t}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No transactions match your search or filters.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Transactions;