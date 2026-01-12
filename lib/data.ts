import { Category, Wallet, Transaction } from './types';

export const initialCategories: Category[] = [
    { id: 'c1', name: 'Food & Drink', icon: 'Utensils', color: 'bg-orange-500', type: 'expense' },
    { id: 'c2', name: 'Transport', icon: 'Car', color: 'bg-blue-500', type: 'expense' },
    { id: 'c3', name: 'Shopping', icon: 'ShoppingBag', color: 'bg-pink-500', type: 'expense' },
    { id: 'c4', name: 'Bills', icon: 'Receipt', color: 'bg-red-500', type: 'expense' },
    { id: 'c5', name: 'Salary', icon: 'Briefcase', color: 'bg-green-500', type: 'income' },
    { id: 'c6', name: 'Investments', icon: 'TrendingUp', color: 'bg-emerald-500', type: 'income' },
    { id: 'c7', name: 'Entertainment', icon: 'Film', color: 'bg-purple-500', type: 'expense' },
    { id: 'c8', name: 'Health', icon: 'Heart', color: 'bg-rose-500', type: 'expense' },
    { id: 'c9', name: 'Education', icon: 'BookOpen', color: 'bg-indigo-500', type: 'expense' },
    { id: 'c10', name: 'Others', icon: 'MoreHorizontal', color: 'bg-slate-500', type: 'expense' },
];

export const initialWallets: Wallet[] = [
    { id: 'w1', name: 'Cash', type: 'cash', balance: 0, color: 'bg-green-600' },
];

export const initialTransactions: Transaction[] = [];
