import React from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useCurrency } from '../hooks/useCurrency';
import TransactionCard from '../components/TransactionCard';
import BudgetCard from '../components/BudgetCard';
import { CategoryDonutChart } from '../components/Charts';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchExchangeRates } from '../services/api';
import AnimatedNumber from '../components/AnimatedNumber';
import './Pages.css';

const Dashboard = () => {
    const { transactions, deleteTransaction } = useTransactions();
    const { formatCurrency } = useCurrency();
    const navigate = useNavigate();

    const [exchangeData, setExchangeData] = React.useState(null);
    const [ratesLoading, setRatesLoading] = React.useState(true);

    React.useEffect(() => {
        const getRates = async () => {
            setRatesLoading(true);
            const data = await fetchExchangeRates();
            if (data && data.rates) {
                setExchangeData(data.rates);
            }
            setRatesLoading(false);
        };
        getRates();
    }, []);

    const handleEdit = (transaction) => {
        navigate(`/transactions/new?edit=${transaction.id}`);
    };

    const handleDelete = (id) => {
        deleteTransaction(id);
    };

    const recentTransactions = transactions.slice(0, 5);

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
    const netBalance = totalIncome - totalExpenses;

    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
    }, {});
    const expensesByCategory = Object.keys(grouped).map(key => ({ name: key, value: grouped[key] })).sort((a, b) => b.value - a.value);

    const topCategory = expensesByCategory.length > 0 ? expensesByCategory[0] : null;

    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <header className="page-header dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here&apos;s your financial overview.</p>
                </div>
                {ratesLoading ? (
                    <div className="exchange-rates" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                        loading rates...
                    </div>
                ) : exchangeData ? (
                    // Fix #6: Added optional chaining (?.) and nullish fallback ('N/A') so a missing
                    // USD or EUR key in the API response doesn't crash the dashboard
                    <div className="exchange-rates">
                        <div><strong>Current Exchange Rates:</strong></div>
                        <div>1 INR = {exchangeData.USD?.toFixed(4) ?? 'N/A'} USD</div>
                        <div>1 INR = {exchangeData.EUR?.toFixed(4) ?? 'N/A'} EUR</div>
                    </div>
                ) : null}
            </header>

            <div className="summary-cards">
                <div className="summary-card balance">
                    <h4>Net Balance</h4>
                    <h2>
                        <AnimatedNumber
                            value={netBalance}
                            formatFn={(val) => formatCurrency(val)}
                        />
                    </h2>
                </div>
                <div className="summary-card income">
                    <h4>Total Income</h4>
                    <h2 className="text-success">
                        <AnimatedNumber
                            value={totalIncome}
                            formatFn={(val) => formatCurrency(val)}
                        />
                    </h2>
                </div>
                <div className="summary-card expenses">
                    <h4>Total Expenses</h4>
                    <h2 className="text-danger">
                        <AnimatedNumber
                            value={totalExpenses}
                            formatFn={(val) => formatCurrency(val)}
                        />
                    </h2>
                </div>
                <div className="summary-card top-category">
                    <h4>Top Expense</h4>
                    <h2>{topCategory ? topCategory.name : 'N/A'}</h2>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-main">
                    <BudgetCard />
                    <div className="recent-transactions">
                        <div className="section-header">
                            <h3>Recent Transactions</h3>
                            <Link to="/transactions" className="link-primary">View All</Link>
                        </div>
                        {recentTransactions.length > 0 ? (
                            recentTransactions.map(t => <TransactionCard key={t.id} transaction={t} onDelete={handleDelete} onEdit={handleEdit} />)
                        ) : (
                            <p className="empty-state">No transactions yet. <Link to="/transactions/new">Add one!</Link></p>
                        )}
                    </div>
                </div>
                <div className="dashboard-sidebar">
                    <CategoryDonutChart data={expensesByCategory} />
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
