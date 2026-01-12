import { Category, Wallet, Transaction } from './types';

export const initialCategories: Category[] = [
    { id: 'c1', name: 'Food & Drink', icon: 'Utensils', color: 'bg-orange-500', type: 'expense' },
    { id: 'c2', name: 'Transport', icon: 'Car', color: 'bg-blue-500', type: 'expense' },
    { id: 'c3', name: 'Shopping', icon: 'ShoppingBag', color: 'bg-pink-500', type: 'expense' },
    { id: 'c4', name: 'Bills', icon: 'Receipt', color: 'bg-red-500', type: 'expense' },
    { id: 'c5', name: 'Salary', icon: 'Briefcase', color: 'bg-green-500', type: 'income' },
    { id: 'c6', name: 'Freelance', icon: 'Laptop', color: 'bg-emerald-500', type: 'income' },
    { id: 'c7', name: 'Entertainment', icon: 'Film', color: 'bg-purple-500', type: 'expense' },
    { id: 'c8', name: 'Health', icon: 'Heart', color: 'bg-rose-500', type: 'expense' },
];

export const initialWallets: Wallet[] = [
    { id: 'w1', name: 'BCA', type: 'bank', balance: 5000000, color: 'bg-blue-600', accountNumber: '1234567890' },
    { id: 'w2', name: 'GoPay', type: 'ewallet', balance: 150000, color: 'bg-cyan-500' },
    { id: 'w3', name: 'Cash', type: 'cash', balance: 250000, color: 'bg-green-600' },
    { id: 'w4', name: 'Dana', type: 'ewallet', balance: 50000, color: 'bg-blue-400' },
    { id: 'w5', name: 'ShopeePay', type: 'ewallet', balance: 75000, color: 'bg-orange-500' },
];

export const initialTransactions: Transaction[] = [
    { id: 't1', amount: 25000, type: 'expense', categoryId: 'c1', walletId: 'w3', date: new Date().toISOString(), note: 'Lunch' },
    { id: 't2', amount: 15000, type: 'expense', categoryId: 'c2', walletId: 'w2', date: new Date(Date.now() - 86400000).toISOString(), note: 'Gojek' },
    { id: 't3', amount: 5000000, type: 'income', categoryId: 'c5', walletId: 'w1', date: new Date(Date.now() - 172800000).toISOString(), note: 'Monthly Salary' },
];
