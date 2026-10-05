import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line react-refresh/only-export-components
export const FinanceContext = createContext();

const safeParse = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const DEFAULT_CATEGORY_BUDGETS = {
  Food: 12000,
  Travel: 6000,
  Rent: 20000,
  Shopping: 5000,
  Entertainment: 3000,
  Health: 4000,
  Utilities: 4000,
  Subscriptions: 1500
};

const DEFAULT_GOALS = [
  {
    id: 'goal-1',
    title: 'Emergency Fund',
    targetAmount: 150000,
    currentAmount: 65000,
    deadline: '2026-12-31',
    category: 'Safety',
    color: '#3b82f6'
  },
  {
    id: 'goal-2',
    title: 'New M3 MacBook Pro',
    targetAmount: 180000,
    currentAmount: 120000,
    deadline: '2026-11-15',
    category: 'Tech',
    color: '#10b981'
  }
];

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => safeParse('transactions', []));
  const [monthlyBudget, setMonthlyBudget] = useState(() => safeParse('budget', 50000));
  const [categoryBudgets, setCategoryBudgets] = useState(() => safeParse('category_budgets', DEFAULT_CATEGORY_BUDGETS));
  const [savingsGoals, setSavingsGoals] = useState(() => safeParse('savings_goals', DEFAULT_GOALS));

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(monthlyBudget));
  }, [monthlyBudget]);

  useEffect(() => {
    localStorage.setItem('category_budgets', JSON.stringify(categoryBudgets));
  }, [categoryBudgets]);

  useEffect(() => {
    localStorage.setItem('savings_goals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [{ id: uuidv4(), date: new Date().toISOString(), ...transaction }, ...prev]);
  };

  const updateTransaction = (id, updatedFields) => {
    setTransactions(prev => prev.map(t => String(t.id) === String(id) ? { ...t, ...updatedFields } : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => String(t.id) !== String(id)));
  };

  const updateBudget = (newBudget) => {
    setMonthlyBudget(newBudget);
  };

  const updateCategoryBudget = (category, limit) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [category]: Number(limit)
    }));
  };

  const addGoal = (goal) => {
    setSavingsGoals(prev => [{ id: uuidv4(), currentAmount: 0, color: '#3b82f6', ...goal }, ...prev]);
  };

  const updateGoal = (id, updatedFields) => {
    setSavingsGoals(prev => prev.map(g => String(g.id) === String(id) ? { ...g, ...updatedFields } : g));
  };

  const deleteGoal = (id) => {
    setSavingsGoals(prev => prev.filter(g => String(g.id) !== String(id)));
  };

  const contributeToGoal = (id, amount) => {
    setSavingsGoals(prev => prev.map(g => {
      if (String(g.id) === String(id)) {
        return { ...g, currentAmount: Math.max(0, Number(g.currentAmount) + Number(amount)) };
      }
      return g;
    }));
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      monthlyBudget,
      updateBudget,
      categoryBudgets,
      updateCategoryBudget,
      savingsGoals,
      addGoal,
      updateGoal,
      deleteGoal,
      contributeToGoal
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
