import React, { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { useCurrency } from '../hooks/useCurrency';
import { CategoryDonutChart, ExpenseTrendAreaChart, IncomeExpenseBarChart, CashFlowAreaChart } from '../components/Charts';
import { format, differenceInCalendarMonths } from 'date-fns';
import { motion } from 'framer-motion';
import './Pages.css';

const Analytics = () => {
    const { transactions } = useContext(FinanceContext);
    const { formatCurrency } = useCurrency();

    const {
        pieData,
        trendData,
        comparisonData,
        cashFlowData,
        kpiTopCategory,
        kpiAvgExpense,
        kpiSavingsRate
    } = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense');
        const incomes = transactions.filter(t => t.type === 'income');

        const totalExpense = expenses.reduce((acc, t) => acc + Number(t.amount), 0);
        const totalIncome = incomes.reduce((acc, t) => acc + Number(t.amount), 0);

        const netSavings = totalIncome - totalExpense;
        const sr = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;

        // Pie / Top Category
        const cMap = {};
        expenses.forEach(t => {
            cMap[t.category] = (cMap[t.category] || 0) + Number(t.amount);
        });
        const pieMapped = Object.keys(cMap).map(k => ({ name: k, value: cMap[k] })).sort((a, b) => b.value - a.value);
        const topCat = pieMapped.length > 0 ? pieMapped[0].name : 'N/A';

        // Monthly grouping
        const monthMap = {};
        const sortedTx = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

        let cumulativeBalance = 0;
        sortedTx.forEach(t => {
            const dateObj = new Date(t.date);
            const m = format(dateObj, 'MMM yy');

            if (!monthMap[m]) {
                monthMap[m] = {
                    month: m,
                    name: m,
                    amount: 0,
                    income: 0,
                    expense: 0,
                    balance: cumulativeBalance
                };
            }

            const numAmt = Number(t.amount);
            if (t.type === 'expense') {
                monthMap[m].amount += numAmt;
                monthMap[m].expense += numAmt;
                cumulativeBalance -= numAmt;
            } else {
                monthMap[m].income += numAmt;
                cumulativeBalance += numAmt;
            }
            monthMap[m].balance = cumulativeBalance;
        });

        const sortedMonths = Object.values(monthMap);

        // Fix #7: Average monthly expense — divide by the span between first and last transaction
        // date (in calendar months), not just the count of months with transactions.
        // This gives a true "average per calendar month" even with gaps in the data.
        let avgExp = 0;
        if (sortedTx.length > 0) {
            const firstDate = new Date(sortedTx[0].date);
            const lastDate = new Date(sortedTx[sortedTx.length - 1].date);
            const spanMonths = differenceInCalendarMonths(lastDate, firstDate) + 1;
            avgExp = totalExpense / spanMonths;
        }

        return {
            pieData: pieMapped,
            trendData: sortedMonths,
            comparisonData: sortedMonths,
            cashFlowData: sortedMonths,
            kpiTopCategory: topCat,
            kpiAvgExpense: avgExp,
            kpiSavingsRate: sr
        };
    }, [transactions]);


    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <header className="page-header">
                <h1>Financial Analytics</h1>
                <p>Enterprise-grade visual insights into your wealth.</p>
            </header>

            {/* KPI Section */}
            <div className="summary-cards">
                <div className="summary-card">
                    <h4>Average Monthly Expense</h4>
                    <h2>{formatCurrency(kpiAvgExpense)}</h2>
                </div>
                <div className="summary-card">
                    <h4>Savings Rate</h4>
                    <h2>{kpiSavingsRate}%</h2>
                </div>
                <div className="summary-card">
                    <h4>Top Spending Category</h4>
                    <h2>{kpiTopCategory}</h2>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                <div className="chart-full-width">
                    <CashFlowAreaChart data={cashFlowData} />
                </div>
                <IncomeExpenseBarChart data={comparisonData} />
                <CategoryDonutChart data={pieData} />
                <div className="chart-full-width">
                    {/* Fix #13: Updated import to ExpenseTrendAreaChart (accurate name) */}
                    <ExpenseTrendAreaChart data={trendData} />
                </div>
            </div>
        </motion.div>
    );
};

export default Analytics;
