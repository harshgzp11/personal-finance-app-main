import React from 'react';
import BudgetCard from '../components/BudgetCard';
import { useTransactions } from '../hooks/useTransactions';
import TransactionCard from '../components/TransactionCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Pages.css';

const Budget = () => {
    const { transactions, deleteTransaction } = useTransactions();
    const navigate = useNavigate();
    
    const handleEdit = (transaction) => {
        navigate(`/transactions/new?edit=${transaction.id}`);
    };

    const handleDelete = (id) => {
        deleteTransaction(id);
    };
    
    // Get all expenses for current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthExpenses = transactions.filter(t => {
        const d = new Date(t.date);
        return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    return (
        <motion.div 
            className="page-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <header className="page-header">
                <h1>Budget Planner</h1>
                <p>Manage your monthly spending limit.</p>
            </header>
            
            <div className="budget-layout">
                <BudgetCard />
                
                <h3>This Month's Spending</h3>
                <div className="transactions-list">
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
