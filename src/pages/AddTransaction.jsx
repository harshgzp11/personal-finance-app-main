import React, { useEffect } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './Pages.css';

const schema = yup.object().shape({
    type: yup.string().oneOf(['expense', 'income']).required('Type is required'),
    title: yup.string().required('Title is required'),
    amount: yup.number().typeError('Amount must be a number').positive('Amount must be positive').required('Amount is required'),
    category: yup.string().required('Category is required'),
    date: yup.string().required('Date is required'),
    notes: yup.string().notRequired(),
    recurring: yup.boolean()
});

const AddTransaction = () => {
    const { addTransaction, updateTransaction, transactions } = useTransactions();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            title: '',
            amount: '',
            category: '',
            date: new Date().toISOString().split('T')[0],
            type: 'expense',
            notes: '',
            recurring: false
        }
    });

    useEffect(() => {
        if (editId) {
            const tx = transactions.find(t => String(t.id) === String(editId));
            if (tx) {
                reset({
                    title: tx.title,
                    amount: tx.amount,
                    category: tx.category,
                    date: new Date(tx.date).toISOString().split('T')[0],
                    type: tx.type,
                    notes: tx.notes || '',
                    recurring: tx.recurring || false
                });
            }
        }
    }, [editId, transactions, reset]);

    const txType = watch('type');

    const onSubmit = (data) => {
        const txData = {
            ...data,
            amount: Number(data.amount)
        };

        if (editId) {
            updateTransaction(editId, txData);
            toast.success("Transaction updated successfully!");
        } else {
            addTransaction(txData);
            toast.success("Transaction added successfully!");
        }
        navigate('/transactions');
    };

    const expenseCategories = ['Food', 'Travel', 'Rent', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Subscriptions'];
    const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Other'];
    const categories = txType === 'income' ? incomeCategories : expenseCategories;

    return (
        <motion.div
            className="page-container"
            style={{ maxWidth: '600px' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="form-card">
                <h2>{editId ? 'Edit Transaction' : 'New Transaction'}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="transaction-form">

                    <div className="form-group">
                        <label>Type *</label>
                        <select {...register("type")} className={`form-input ${errors.type ? 'input-error' : ''}`}>
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                        {errors.type && <p className="form-error">{errors.type.message}</p>}
                    </div>

                    <div className="form-group">
                        <label>Title *</label>
                        <input type="text" {...register("title")} placeholder="e.g. Groceries" className={`form-input ${errors.title ? 'input-error' : ''}`} />
                        {errors.title && <p className="form-error">{errors.title.message}</p>}
                    </div>

                    {/* Fix #1: Replaced corrupted ₹ bytes with proper Unicode symbol */}
                    <div className="form-group">
                        <label>Amount (₹) *</label>
                        <input type="number" step="0.01" {...register("amount")} placeholder="0.00" className={`form-input ${errors.amount ? 'input-error' : ''}`} />
                        {errors.amount && <p className="form-error">{errors.amount.message}</p>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category *</label>
                            <select {...register("category")} className={`form-input ${errors.category ? 'input-error' : ''}`}>
                                <option value="">Select...</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors.category && <p className="form-error">{errors.category.message}</p>}
                        </div>
                        <div className="form-group">
                            <label>Date *</label>
                            <input type="date" {...register("date")} className={`form-input ${errors.date ? 'input-error' : ''}`} />
                            {errors.date && <p className="form-error">{errors.date.message}</p>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Notes (Optional)</label>
                        <textarea {...register("notes")} placeholder="Additional details..." className="form-input" style={{ minHeight: '80px', resize: 'vertical' }} />
                    </div>

                    {/* Fix #10: Label now dynamically says "expense" or "transaction" based on type */}
                    <div className="recurring-group">
                        <input type="checkbox" id="recurring" {...register("recurring")} />
                        <label htmlFor="recurring">Mark as recurring {txType === 'income' ? 'income' : 'expense'}</label>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate(-1)} className="btn-cancel">Cancel</button>
                        <button type="submit" className="btn-submit">{editId ? 'Save Changes' : 'Add Transaction'}</button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default AddTransaction;
