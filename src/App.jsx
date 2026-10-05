import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FinanceProvider } from './context/FinanceContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Budget from './pages/Budget';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import CommandPalette from './components/CommandPalette';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <FinanceProvider>
      <BrowserRouter>
        <div className="app-container">
          <ToastContainer position="bottom-right" theme={theme} />
          <Navbar
            theme={theme}
            toggleTheme={toggleTheme}
            onOpenCommandPalette={() => setCmdOpen(true)}
          />
          <CommandPalette
            isOpen={cmdOpen}
            onClose={() => setCmdOpen(false)}
            theme={theme}
            toggleTheme={toggleTheme}
          />
          <main className="main-content">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/transactions/new" element={<AddTransaction />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </ErrorBoundary>
          </main>
        </div>
      </BrowserRouter>
    </FinanceProvider>
  );
}

export default App;
