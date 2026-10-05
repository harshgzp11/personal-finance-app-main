import React, { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import { useCurrency } from '../hooks/useCurrency';
import { FiEdit2, FiCheck } from 'react-icons/fi';
import './BudgetCard.css';

const BudgetCard = () => {
    const { monthlyBudget, updateBudget, totalSpent, remainingBudget, percentageUsed } = useBudget();
    const { formatCurrency } = useCurrency();

    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(monthlyBudget);

    const handleSave = () => {
        updateBudget(Number(editValue));
        setIsEditing(false);
    };

    const isWarning = percentageUsed >= 80;
    const isDanger = percentageUsed >= 100;

    let progressColor = '#10b981'; // Green
    if (isDanger) progressColor = '#ef4444'; // Red
    else if (isWarning) progressColor = '#f59e0b'; // Orange

    return (
        <div className="budget-card">
            <div className="bc-header">
                <h3>Monthly Budget</h3>
                {isEditing ? (
                    <div className="bc-edit-mode">
                        <input 
                            type="number" 
                            value={editValue} 
                            onChange={(e) => setEditValue(e.target.value)} 
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSave();
                            }}
                            className="bg-input"
                            autoFocus
                        />
                        <button onClick={handleSave} className="btn-icon text-success"><FiCheck /></button>
                    </div>
                ) : (
                    <div className="bc-display-mode">
                        <span className="bc-amount">{formatCurrency(monthlyBudget)}</span>
                        <button onClick={() => setIsEditing(true)} className="btn-icon"><FiEdit2 /></button>
                    </div>
                )}
            </div>

            <div className="bc-stats">
                <div className="bc-stat">
                    <span>Total Spent</span>
                    <strong>{formatCurrency(totalSpent)}</strong>
                </div>
                <div className="bc-stat">
                    <span>Remaining</span>
                    <strong className={remainingBudget < 0 ? 'text-danger' : 'text-success'}>
                        {formatCurrency(remainingBudget)}
                    </strong>
                </div>
            </div>

            <div className="bc-progress-container">
                <div className="bc-progress-bar">
                    <div 
                        className="bc-progress-fill" 
                        style={{ width: `${Math.min(percentageUsed, 100)}%`, backgroundColor: progressColor }}
                    ></div>
                </div>
                <p className="bc-percentage">{percentageUsed.toFixed(1)}% used</p>
            </div>
        </div>
    );
};

export default BudgetCard;
