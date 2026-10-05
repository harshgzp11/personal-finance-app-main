import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiHome, FiList, FiPlusCircle, FiTarget, FiPieChart, FiSun, FiMoon, FiArrowRight } from 'react-icons/fi';
import { useTransactions } from '../hooks/useTransactions';
import { useCurrency } from '../hooks/useCurrency';
import './CommandPalette.css';

const CommandPalette = ({ isOpen, onClose, theme, toggleTheme }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const { transactions } = useTransactions();
    const { formatCurrency } = useCurrency();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (isOpen) {
                    onClose();
                } else {
                    // Open
                    setQuery('');
                }
            } else if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const navigateTo = (path) => {
        navigate(path);
        onClose();
    };

    const navigationActions = [
        { label: 'Go to Dashboard', icon: <FiHome />, action: () => navigateTo('/dashboard'), hint: 'Navigation' },
        { label: 'View Transactions', icon: <FiList />, action: () => navigateTo('/transactions'), hint: 'Navigation' },
        { label: 'Add New Transaction', icon: <FiPlusCircle />, action: () => navigateTo('/transactions/new'), hint: 'Action' },
        { label: 'Budget Planner', icon: <FiTarget />, action: () => navigateTo('/budget'), hint: 'Navigation' },
        { label: 'Analytics & Insights', icon: <FiPieChart />, action: () => navigateTo('/analytics'), hint: 'Navigation' },
        { label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, icon: theme === 'dark' ? <FiSun /> : <FiMoon />, action: () => { toggleTheme(); onClose(); }, hint: 'Theme' },
    ];

    const filteredNav = navigationActions.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase())
    );

    const matchingTx = query.trim() ? transactions.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5) : [];

    return (
        <div className="cmd-overlay" onClick={onClose}>
            <div className="cmd-modal" onClick={e => e.stopPropagation()}>
                <div className="cmd-header">
                    <FiSearch className="cmd-search-icon" />
                    <input
                        type="text"
                        autoFocus
                        placeholder="Type a command or search transactions... (ESC to exit)"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="cmd-input"
                    />
                    <kbd className="cmd-badge">ESC</kbd>
                </div>

                <div className="cmd-body">
                    {filteredNav.length > 0 && (
                        <div className="cmd-section">
                            <span className="cmd-section-title">Navigation & Quick Actions</span>
                            {filteredNav.map((item, idx) => (
                                <button key={idx} className="cmd-item" onClick={item.action}>
                                    <div className="cmd-item-left">
                                        <span className="cmd-icon-box">{item.icon}</span>
                                        <span className="cmd-item-label">{item.label}</span>
                                    </div>
                                    <span className="cmd-item-hint">{item.hint}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {matchingTx.length > 0 && (
                        <div className="cmd-section">
                            <span className="cmd-section-title">Transactions</span>
                            {matchingTx.map(t => (
                                <button
                                    key={t.id}
                                    className="cmd-item"
                                    onClick={() => navigateTo(`/transactions/new?edit=${t.id}`)}
                                >
                                    <div className="cmd-item-left">
                                        <span className={`cmd-dot ${t.type}`}></span>
                                        <div className="cmd-tx-info">
                                            <span className="cmd-item-label">{t.title}</span>
                                            <span className="cmd-tx-category">{t.category}</span>
                                        </div>
                                    </div>
                                    <div className="cmd-item-right">
                                        <span className={`cmd-amount ${t.type}`}>
                                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                        </span>
                                        <FiArrowRight className="cmd-arrow" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {filteredNav.length === 0 && matchingTx.length === 0 && (
                        <div className="cmd-empty">
                            No matching commands or transactions found for &ldquo;{query}&rdquo;
                        </div>
                    )}
                </div>
                <div className="cmd-footer">
                    <span>Tip: Press <kbd>Ctrl</kbd> + <kbd>K</kbd> anywhere to trigger Quick Search</span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
