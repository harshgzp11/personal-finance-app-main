import React, { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { useCurrency } from '../hooks/useCurrency';
import { CategoryDonutChart, ExpenseTrendAreaChart, IncomeExpenseBarChart, CashFlowAreaChart, ForecastLineChart } from '../components/Charts';
import { format, differenceInCalendarMonths } from 'date-fns';
import { motion } from 'framer-motion';
import { FiCpu, FiAlertCircle, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import AnimatedNumber from '../components/AnimatedNumber';
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

        // 6-Month Predictive Savings Forecast
        const recentMonths = sortedMonths.slice(-3);
        const avgMonthlyNet = recentMonths.length > 0
            ? recentMonths.reduce((sum, m) => sum + (m.income - m.expense), 0) / recentMonths.length
            : 0;

        const forecastData = [];
        let runningProjected = cumulativeBalance;
        const now = new Date();
        for (let i = 1; i <= 6; i++) {
            const nextDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
            runningProjected += avgMonthlyNet;
            forecastData.push({
                month: format(nextDate, 'MMM yy'),
                projected: Math.round(runningProjected),
                baseline: cumulativeBalance
            });
        }

        // Smart Spending Insights / AI Rules
        const insights = [];
        if (Number(sr) >= 30) {
            insights.push({
                type: 'success',
                title: 'High Savings Rate',
                message: `You're saving ${sr}% of income! Excellent financial resilience.`
            });
        } else if (Number(sr) > 0 && Number(sr) < 15) {
            insights.push({
                type: 'warning',
                title: 'Low Savings Rate Alert',
                message: `Your savings rate is ${sr}%. Target at least 20% by cutting non-essential expenses.`
            });
        } else if (Number(sr) <= 0 && totalIncome > 0) {
            insights.push({
                type: 'danger',
                title: 'Deficit Alert',
                message: 'Your expenses exceed your current income. Review top categories immediately.'
            });
        }

        if (topCat !== 'N/A' && pieMapped.length > 0) {
            const topPct = ((pieMapped[0].value / (totalExpense || 1)) * 100).toFixed(0);
            if (Number(topPct) > 40) {
                insights.push({
                    type: 'warning',
                    title: `Heavy ${topCat} Concentration`,
                    message: `${topCat} accounts for ${topPct}% of all your expenses. Try setting a strict limit in Budget Planner.`
                });
            }
        }

        return {
            pieData: pieMapped,
            trendData: sortedMonths,
            comparisonData: sortedMonths,
            cashFlowData: sortedMonths,
            forecastData,
            insights,
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
                    <h2>
                        <AnimatedNumber
                            value={kpiAvgExpense}
                            formatFn={(val) => formatCurrency(val)}
                        />
                    </h2>
                </div>
                <div className="summary-card">
                    <h4>Savings Rate</h4>
                    <h2 className={Number(kpiSavingsRate) >= 20 ? 'text-success' : 'text-warning'}>
                        {kpiSavingsRate}%
                    </h2>
                </div>
                <div className="summary-card">
                    <h4>Top Spending Category</h4>
                    <h2>{kpiTopCategory}</h2>
                </div>
            </div>

            {/* Smart Spending Insights / AI Coach Card */}
            {insights.length > 0 && (
                <div className="ai-insights-panel">
                    <div className="ai-insights-header">
                        <FiCpu className="ai-insights-icon" />
                        <div>
                            <h3>AI Spending Intelligence & Coaching</h3>
                            <p>Real-time pattern analysis and proactive budget advisory.</p>
                        </div>
                    </div>
                    <div className="ai-insights-grid">
                        {insights.map((ins, idx) => (
                            <div key={idx} className={`ai-insight-card ${ins.type}`}>
                                <div className="ai-insight-top">
                                    {ins.type === 'success' ? (
                                        <FiCheckCircle className="text-success" />
                                    ) : ins.type === 'danger' ? (
                                        <FiAlertCircle className="text-danger" />
                                    ) : (
                                        <FiTrendingUp className="text-warning" />
                                    )}
                                    <span className="ai-insight-title">{ins.title}</span>
                                </div>
                                <p className="ai-insight-msg">{ins.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Charts Grid */}
            <div className="charts-grid">
                <div className="chart-full-width">
                    <CashFlowAreaChart data={cashFlowData} />
                </div>
                <IncomeExpenseBarChart data={comparisonData} />
                <CategoryDonutChart data={pieData} />
                <div className="chart-full-width">
                    <ExpenseTrendAreaChart data={trendData} />
                </div>
                {/* 6-Month Wealth Forecast */}
                <div className="chart-full-width">
                    <ForecastLineChart data={forecastData} />
                </div>
            </div>
        </motion.div>
    );
};

export default Analytics;
