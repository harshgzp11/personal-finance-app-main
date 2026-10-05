import React from 'react';
import PropTypes from 'prop-types';
import { FiArrowUpCircle, FiArrowDownCircle, FiEdit2, FiTrash2, FiRepeat } from 'react-icons/fi';
import { format } from 'date-fns';
import { useCurrency } from '../hooks/useCurrency';
import './TransactionCard.css';

// Fix #2: Replaced corrupted emoji bytes with react-icons (FiArrowUpCircle / FiArrowDownCircle)
const TransactionCard = ({ transaction, onDelete, onEdit }) => {
    const { formatCurrency } = useCurrency();
    const isIncome = transaction.type === 'income';

    return (
        <div className={`transaction-card ${isIncome ? 'income' : 'expense'} ${transaction.recurring ? 'recurring-highlight' : ''}`}>
            <div className="tc-icon">
                {isIncome ? <FiArrowUpCircle /> : <FiArrowDownCircle />}
            </div>
            <div className="tc-details">
                <h4>{transaction.title} {transaction.recurring && <FiRepeat className="recurring-icon" title="Recurring" />}</h4>
                <p>
                    <span className={`tx-type-badge ${isIncome ? 'income' : 'expense'}`}>
                        {transaction.type}
                    </span>
                    <span className="tx-meta">
                        {transaction.category} &bull; {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </span>
                </p>
            </div>
            <div className="tc-amount">
                <span className={isIncome ? 'text-success' : 'text-danger'}>
                    {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
            </div>
            <div className="tc-actions">
                <button onClick={() => onEdit(transaction)} className="btn-icon"><FiEdit2 /></button>
                <button onClick={() => onDelete(transaction.id)} className="btn-icon danger"><FiTrash2 /></button>
            </div>
        </div>
    );
};

TransactionCard.propTypes = {
    transaction: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['income', 'expense']).isRequired,
        title: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        category: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        recurring: PropTypes.bool
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired
};

export default TransactionCard;
