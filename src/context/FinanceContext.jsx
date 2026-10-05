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

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => safeParse('transactions', []));

  const [monthlyBudget, setMonthlyBudget] = useState(() => safeParse('budget', 50000));

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(monthlyBudget));
  }, [monthlyBudget]);

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

  return (
    <FinanceContext.Provider value={{ transactions, addTransaction, updateTransaction, deleteTransaction, monthlyBudget, updateBudget }}>
      {children}
    </FinanceContext.Provider>
  );
};
