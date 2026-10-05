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
import Analytics from './pages/Analytics';

// Fix #4: Wrapped all route pages in <ErrorBoundary> so a crash in one page
//          never takes down the whole app — just that section.
// Fix #9: Dashboard NavLink now uses /dashboard (changed inside Navbar.jsx)
// Fix #14: Added catch-all <Route path="*"> to redirect unknown URLs to dashboard

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

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
          <Navbar theme={theme} toggleTheme={toggleTheme} />
          <main className="main-content">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/transactions/new" element={<AddTransaction />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/analytics" element={<Analytics />} />
                {/* Fix #14: Catch-all route — any unknown URL redirects to dashboard */}
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
