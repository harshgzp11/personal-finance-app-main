import React, { useState, useContext } from 'react';
import BudgetCard from '../components/BudgetCard';
import { FinanceContext } from '../context/FinanceContext';
import { useTransactions } from '../hooks/useTransactions';
import { useCurrency } from '../hooks/useCurrency';
import TransactionCard from '../components/TransactionCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSliders, FiCheck, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import './Pages.css';

const Budget = () => {
    const { categoryBudgets, updateCategoryBudget } = useContext(FinanceContext);
    const { transactions, deleteTransaction } = useTransactions();
    const { formatCurrency } = useCurrency();
    const navigate = useNavigate();

    const [editingCategory, setEditingCategory] = useState(null);
    const [editLimit, setEditLimit] = useState('');

    const handleEdit = (transaction) => {
        navigate(`/transactions/new?edit=${transaction.id}`);
    };

    const handleDelete = (id) => {
        deleteTransaction(id);
    };

    // Current month expenses
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthExpenses = transactions.filter(t => {
        const d = new Date(t.date);
        return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    // Compute spent per category for current month
    const categorySpending = currentMonthExpenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
    }, {});

    const categories = Object.keys(categoryBudgets);

    const handleSaveLimit = (cat) => {
        if (!isNaN(editLimit) && Number(editLimit) >= 0) {
            updateCategoryBudget(cat, Number(editLimit));
        }
        setEditingCategory(null);
    };

    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <header className="page-header">
                <h1>Budget & Limits Planner</h1>
                <p>Manage your overall monthly budget and fine-tune limits per category.</p>
            </header>

            <div className="budget-layout">
                {/* Overall Monthly Budget Card */}
                <BudgetCard />

                {/* Per-Category Budgets Section */}
                <div className="category-budgets-section">
                    <div className="section-header" style={{ marginTop: '2.5rem', marginBottom: '1.25rem' }}>
                        <div>
                            <h3>Category Spending Limits</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                                Set targets for each expense category to stop overspending before it happens.
                            </p>
                        </div>
                    </div>

                    <div className="category-budget-grid">
                        {categories.map(cat => {
                            const limit = categoryBudgets[cat] || 0;
                            const spent = categorySpending[cat] || 0;
                            const percent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
                            const isOver = limit > 0 && spent > limit;
                            const isNear = limit > 0 && spent >= limit * 0.8 && !isOver;

                            let statusClass = 'normal';
                            if (isOver) statusClass = 'danger';
                            else if (isNear) statusClass = 'warning';

                            return (
                                <div key={cat} className={`cat-budget-card ${statusClass}`}>
                                    <div className="cat-budget-header">
                                        <span className="cat-budget-title">{cat}</span>
                                        {isOver ? (
                                            <span className="cat-budget-alert text-danger"><FiAlertTriangle /> Exceeded</span>
                                        ) : isNear ? (
                                            <span className="cat-budget-alert text-warning"><FiAlertTriangle /> 80%+ Used</span>
                                        ) : (
                                            <span className="cat-budget-alert text-success"><FiCheckCircle /> Healthy</span>
                                        )}
                                    </div>

                                    <div className="cat-budget-body">
                                        <div className="cat-budget-amounts">
                                            <div>
                                                <span className="cat-sub-label">Spent</span>
                                                <div className="cat-spent-val">{formatCurrency(spent)}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span className="cat-sub-label">Limit</span>
                                                {editingCategory === cat ? (
                                                    <div className="cat-limit-edit">
                                                        <input
                                                            type="number"
                                                            autoFocus
                                                            value={editLimit}
                                                            onChange={e => setEditLimit(e.target.value)}
                                                            className="cat-limit-input"
                                                        />
                                                        <button onClick={() => handleSaveLimit(cat)} className="btn-icon text-success">
                                                            <FiCheck />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="cat-limit-val"
                                                        onClick={() => {
                                                            setEditingCategory(cat);
                                                            setEditLimit(limit);
                                                        }}
                                                        title="Click to edit limit"
                                                    >
                                                        {formatCurrency(limit)} <FiSliders className="edit-hint-icon" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="cat-progress-bar-bg">
                                            <div
                                                className={`cat-progress-fill ${statusClass}`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>

                                        <div className="cat-budget-footer">
                                            <span>{percent}% utilized</span>
                                            <span>
                                                {limit - spent >= 0
                                                    ? `${formatCurrency(limit - spent)} left`
                                                    : `${formatCurrency(Math.abs(limit - spent))} over`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <h3 style={{ marginTop: '3rem' }}>This Month&apos;s Expense History</h3>
                <div className="transactions-list" style={{ marginTop: '1rem' }}>
                    {currentMonthExpenses.length > 0 ? (
                        currentMonthExpenses.map(t => (
                            <TransactionCard key={t.id} transaction={t} onDelete={handleDelete} onEdit={handleEdit} />
                        ))
                    ) : (
                        <div className="empty-state">No expenses recorded this month yet!</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Budget;
