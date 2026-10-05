import { useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';

export const useBudget = () => {
    const context = useContext(FinanceContext);
    if (!context) {
        throw new Error("useBudget must be used within a FinanceProvider");
    }

    const { monthlyBudget, updateBudget, transactions } = context;

    // Fix #5: Only sum expenses from the current month, not all-time
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalSpent = transactions
        .filter(t => {
            if (t.type !== 'expense') return false;
            const d = new Date(t.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const remainingBudget = monthlyBudget - totalSpent;
    const percentageUsed = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

    return {
        monthlyBudget,
        updateBudget,
        totalSpent,
        remainingBudget,
        percentageUsed
    };
};
