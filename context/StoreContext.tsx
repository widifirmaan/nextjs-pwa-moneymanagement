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
        const loadData = async () => {
            try {
                const res = await fetch('/api/data');
                if (!res.ok) throw new Error('Failed to fetch data');
                const data = await res.json();

                // If database is empty, seed it
                if (data.categories.length === 0 && data.wallets.length === 0) {
                    await fetch('/api/seed', { method: 'POST' });
                    // Fetch again
                    const res2 = await fetch('/api/data');
                    const data2 = await res2.json();
                    setCategories(data2.categories);
                    setWallets(data2.wallets);
                    setTransactions(data2.transactions);
                } else {
                    setCategories(data.categories);
                    setWallets(data.wallets);
                    setTransactions(data.transactions);
                }
            } catch (error) {
                console.error("Error loading data:", error);
                // Fallback to initial data if offline/error? 
                // For now, let's keep it empty or retry.
            }
            setIsLoaded(true);
        };
        loadData();
    }, []);

    // Remove the localStorage sync effect
    // useEffect(() => { ... }, [transactions, wallets, categories, isLoaded]);

    const addTransaction = async (t: Omit<Transaction, 'id'>) => {
        const newTransaction = { ...t, id: crypto.randomUUID() };

        // Optimistic UI Update
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

        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTransaction),
            });
            if (!res.ok) {
                // Revert if failed (omitted for brevity in this step, but ideal)
                console.error("Failed to save transaction");
            }
        } catch (error) {
            console.error("Error saving transaction:", error);
        }
    };

    const deleteTransaction = async (id: string) => {
        const t = transactions.find(tx => tx.id === id);
        if (!t) return;

        // Optimistic UI Update
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

        try {
            await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
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
