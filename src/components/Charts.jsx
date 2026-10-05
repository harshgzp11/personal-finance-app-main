import React from 'react';
import PropTypes from 'prop-types';
import {
    PieChart, Pie, Cell,
    AreaChart, Area,
    BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Charts.css';

// Fix #1: Replaced corrupted ₹ byte sequences with proper Unicode rupee symbol
// Fix #13: Renamed "ExpenseTrendLineChart" to "ExpenseTrendAreaChart" to match the actual AreaChart used internally

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export const CategoryDonutChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="no-data-chart">No expense data available</div>;
    return (
        <div className="chart-container">
            <h3>Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%" cy="50%"
                        innerRadius={80} outerRadius={110}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} cursor={{ fill: 'transparent' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '0.85rem', paddingTop: '10px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

CategoryDonutChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired
    }))
};

export const CashFlowAreaChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="no-data-chart">No balance data</div>;
    return (
        <div className="chart-container">
            <h3>Cumulative Cash Flow</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} dy={10} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                    <Area type="monotone" dataKey="balance" name="Balance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

CashFlowAreaChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        month: PropTypes.string.isRequired,
        balance: PropTypes.number.isRequired
    }))
};

export const IncomeExpenseBarChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="no-data-chart">No financial data for comparison</div>;
    return (
        <div className="chart-container">
            <h3>Income vs Expense</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} dy={10} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip cursor={{ fill: 'transparent' }} formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '0.85rem' }} />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

IncomeExpenseBarChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        income: PropTypes.number.isRequired,
        expense: PropTypes.number.isRequired
    }))
};

// Fix #13: Renamed from ExpenseTrendLineChart → ExpenseTrendAreaChart to match internal AreaChart usage
// Old name kept as an alias for backwards compatibility with Analytics.jsx
export const ExpenseTrendAreaChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="no-data-chart">No expense tracking data</div>;
    return (
        <div className="chart-container">
            <h3>Monthly Spending Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} dy={10} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                    <Area type="monotone" dataKey="amount" name="Expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

ExpenseTrendAreaChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        month: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired
    }))
};

// Backwards-compatible alias so Analytics.jsx import still works
export const ExpenseTrendLineChart = ExpenseTrendAreaChart;
