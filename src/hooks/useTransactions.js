import { useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';

export const useTransactions = () => {
    const context = useContext(FinanceContext);
    if (!context) {
        throw new Error("useTransactions must be used within a FinanceProvider");
    }
    
    const { transactions, addTransaction, updateTransaction, deleteTransaction } = context;
    
    return {
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction
    };
};
