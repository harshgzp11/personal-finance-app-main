import React, { useState, useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { useTransactions } from '../hooks/useTransactions';
import { useCurrency } from '../hooks/useCurrency';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiTarget, FiTrendingUp, FiCheckCircle, FiCalendar, FiDollarSign } from 'react-icons/fi';
import './Goals.css';

const Goals = () => {
    const { savingsGoals, addGoal, deleteGoal, contributeToGoal } = useContext(FinanceContext);
    const { formatCurrency } = useCurrency();
    const [isCreating, setIsCreating] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [depositAmount, setDepositAmount] = useState('');

    const [form, setForm] = useState({
        title: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        category: 'Personal',
        color: '#3b82f6'
    });

    const handleCreate = (e) => {
        e.preventDefault();
        if (!form.title || !form.targetAmount) return;

        addGoal({
            title: form.title,
            targetAmount: Number(form.targetAmount),
            currentAmount: Number(form.currentAmount) || 0,
            deadline: form.deadline,
            category: form.category,
            color: form.color
        });

        setForm({
            title: '',
            targetAmount: '',
            currentAmount: '',
            deadline: '',
            category: 'Personal',
            color: '#3b82f6'
        });
        setIsCreating(false);
    };

    const handleContribute = (e) => {
        e.preventDefault();
        if (!depositAmount || !selectedGoal) return;
        contributeToGoal(selectedGoal.id, Number(depositAmount));
        setDepositAmount('');
        setSelectedGoal(null);
    };

    const totalTarget = savingsGoals.reduce((sum, g) => sum + Number(g.targetAmount || 0), 0);
    const totalSaved = savingsGoals.reduce((sum, g) => sum + Number(g.currentAmount || 0), 0);
    const overallProgress = totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0;

    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <header className="page-header goals-header">
                <div>
                    <h1>Savings Goals 🎯</h1>
                    <p>Track targets, fund dreams, and stay disciplined.</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setIsCreating(!isCreating)}
                >
                    <FiPlus /> {isCreating ? 'Close Form' : 'New Goal'}
                </button>
            </header>

            {/* Top Stat Summary Cards */}
            <div className="summary-cards">
                <div className="summary-card">
                    <h4>Total Target</h4>
                    <h2>{formatCurrency(totalTarget)}</h2>
                </div>
                <div className="summary-card">
                    <h4>Total Saved</h4>
                    <h2 className="text-success">{formatCurrency(totalSaved)}</h2>
                </div>
                <div className="summary-card">
                    <h4>Overall Progress</h4>
                    <h2>{overallProgress}%</h2>
                </div>
            </div>

            {/* Creation Form Modal/Card */}
            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        className="goal-form-card"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <h3>Create New Savings Goal</h3>
                        <form onSubmit={handleCreate}>
                            <div className="goal-form-grid">
                                <div className="form-group">
                                    <label>Goal Title *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Vacation in Bali, Emergency Fund"
                                        required
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Target Amount (₹) *</label>
                                    <input
                                        type="number"
                                        placeholder="50000"
                                        required
                                        min="1"
                                        value={form.targetAmount}
                                        onChange={e => setForm({ ...form, targetAmount: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Current Savings (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        min="0"
                                        value={form.currentAmount}
                                        onChange={e => setForm({ ...form, currentAmount: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Target Date</label>
                                    <input
                                        type="date"
                                        value={form.deadline}
                                        onChange={e => setForm({ ...form, deadline: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={form.category}
                                        onChange={e => setForm({ ...form, category: e.target.value })}
                                        className="form-input"
                                    >
                                        <option value="Personal">Personal</option>
                                        <option value="Tech">Tech / Gadgets</option>
                                        <option value="Travel">Travel</option>
                                        <option value="Emergency">Emergency</option>
                                        <option value="Real Estate">Real Estate</option>
                                        <option value="Vehicle">Vehicle</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Accent Color</label>
                                    <div className="color-picker-row">
                                        {['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'].map(c => (
                                            <span
                                                key={c}
                                                className={`color-dot ${form.color === c ? 'active' : ''}`}
                                                style={{ backgroundColor: c }}
                                                onClick={() => setForm({ ...form, color: c })}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="form-actions" style={{ marginTop: '1rem' }}>
                                <button type="button" className="btn-cancel" onClick={() => setIsCreating(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">Add Goal</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Goals Grid */}
            <div className="goals-grid">
                {savingsGoals.length > 0 ? (
                    savingsGoals.map(goal => {
                        const target = Number(goal.targetAmount) || 1;
                        const saved = Number(goal.currentAmount) || 0;
                        const pct = Math.min(100, Math.round((saved / target) * 100));
                        const isCompleted = saved >= target;

                        return (
                            <div key={goal.id} className="goal-card" style={{ borderTop: `4px solid ${goal.color || 'var(--accent-primary)'}` }}>
                                <div className="goal-card-header">
                                    <div>
                                        <span className="goal-badge">{goal.category || 'General'}</span>
                                        <h3 className="goal-title">{goal.title}</h3>
                                    </div>
                                    <button
                                        onClick={() => deleteGoal(goal.id)}
                                        className="btn-icon danger"
                                        title="Delete Goal"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>

                                <div className="goal-progress-wrap">
                                    <div className="goal-amounts">
                                        <span className="goal-saved">{formatCurrency(saved)}</span>
                                        <span className="goal-target">of {formatCurrency(target)}</span>
                                    </div>
                                    <div className="goal-bar-bg">
                                        <div
                                            className="goal-bar-fill"
                                            style={{
                                                width: `${pct}%`,
                                                backgroundColor: isCompleted ? 'var(--success)' : (goal.color || 'var(--accent-primary)')
                                            }}
                                        />
                                    </div>
                                    <div className="goal-meta">
                                        <span>{pct}% funded</span>
                                        {goal.deadline && (
                                            <span className="goal-deadline">
                                                <FiCalendar /> {goal.deadline}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="goal-footer">
                                    {isCompleted ? (
                                        <div className="goal-completed-badge">
                                            <FiCheckCircle /> Goal Achieved!
                                        </div>
                                    ) : (
                                        <button
                                            className="goal-add-funds-btn"
                                            onClick={() => setSelectedGoal(goal)}
                                        >
                                            <FiDollarSign /> Contribute Funds
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                        <p>No savings goals set yet! Start defining targets to supercharge your financial discipline.</p>
                    </div>
                )}
            </div>

            {/* Quick Deposit Modal */}
            <AnimatePresence>
                {selectedGoal && (
                    <div className="cmd-overlay" onClick={() => setSelectedGoal(null)}>
                        <motion.div
                            className="deposit-modal"
                            onClick={e => e.stopPropagation()}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                        >
                            <h3>Contribute to &ldquo;{selectedGoal.title}&rdquo;</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                Currently saved: {formatCurrency(selectedGoal.currentAmount)} / {formatCurrency(selectedGoal.targetAmount)}
                            </p>
                            <form onSubmit={handleContribute}>
                                <div className="form-group" style={{ margin: '1.25rem 0' }}>
                                    <label>Contribution Amount (₹) *</label>
                                    <input
                                        type="number"
                                        autoFocus
                                        required
                                        min="1"
                                        placeholder="e.g. 5000"
                                        value={depositAmount}
                                        onChange={e => setDepositAmount(e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn-cancel" onClick={() => setSelectedGoal(null)}>Cancel</button>
                                    <button type="submit" className="btn-submit">Add Contribution</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Goals;
