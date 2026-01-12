"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Category, Transaction, Wallet } from '@/lib/types';
import { initialCategories, initialTransactions, initialWallets } from '@/lib/data';

interface StoreContextType {
    transactions: Transaction[];
    wallets: Wallet[];
    categories: Category[];
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
    getWalletBalance: (id: string) => number;
    totalBalance: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const loadData = () => {
            const storedTransactions = localStorage.getItem('transactions');
            const storedWallets = localStorage.getItem('wallets');
            const storedCategories = localStorage.getItem('categories');

            if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
            else setTransactions(initialTransactions);

            if (storedWallets) setWallets(JSON.parse(storedWallets));
            else setWallets(initialWallets);

            if (storedCategories) setCategories(JSON.parse(storedCategories));
            else setCategories(initialCategories);

            setIsLoaded(true);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('transactions', JSON.stringify(transactions));
        localStorage.setItem('wallets', JSON.stringify(wallets));
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [transactions, wallets, categories, isLoaded]);

    const addTransaction = (t: Omit<Transaction, 'id'>) => {
        const newTransaction = { ...t, id: crypto.randomUUID() };
        setTransactions(prev => [newTransaction, ...prev]);

        setWallets(prev => prev.map(w => {
            if (w.id === t.walletId) {
                return {
                    ...w,
                    balance: t.type === 'income' ? w.balance + t.amount : w.balance - t.amount
                };
            }
            return w;
        }));
    };

    const deleteTransaction = (id: string) => {
        const t = transactions.find(tx => tx.id === id);
        if (!t) return;

        setTransactions(prev => prev.filter(tx => tx.id !== id));

        setWallets(prev => prev.map(w => {
            if (w.id === t.walletId) {
                return {
                    ...w,
                    balance: t.type === 'income' ? w.balance - t.amount : w.balance + t.amount
                };
            }
            return w;
        }));
    };

    const getWalletBalance = (id: string) => {
        return wallets.find(w => w.id === id)?.balance || 0;
    };

    const totalBalance = wallets.reduce((acc, curr) => acc + curr.balance, 0);

    return (
        <StoreContext.Provider value={{
            transactions,
            wallets,
            categories,
            addTransaction,
            deleteTransaction,
            getWalletBalance,
            totalBalance
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
