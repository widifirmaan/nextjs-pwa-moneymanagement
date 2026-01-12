"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Category, Transaction, Wallet, ExpenseLimits, Notification, SavedCard } from '@/lib/types';
import { startOfDay, startOfWeek, startOfMonth, isAfter } from 'date-fns';

interface StoreContextType {
    transactions: Transaction[];
    wallets: Wallet[];
    categories: Category[];
    notifications: Notification[];
    savedCards: SavedCard[];
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
    deleteTransaction: (id: string) => void;
    getWalletBalance: (id: string) => number;
    totalBalance: number;
    addWallet: (wallet: Omit<Wallet, 'id' | 'userId'>) => Promise<void>;
    updateWallet: (id: string, updates: Partial<Wallet>) => Promise<void>;
    deleteWallet: (id: string) => Promise<void>;
    markNotificationRead: (id: string) => void;
    addCard: (card: Omit<SavedCard, 'id' | 'userId'>) => Promise<void>;
    updateCard: (id: string, updates: Partial<SavedCard>) => Promise<void>;
    deleteCard: (id: string) => Promise<void>;
    isPrivacyMode: boolean;
    togglePrivacyMode: () => void;
    isSetupCompleted: boolean;
    completeSetup: () => Promise<void>;
    installPrompt: any;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
    const [isPrivacyMode, setIsPrivacyMode] = useState(false);
    const [isSetupCompleted, setIsSetupCompleted] = useState(true); // Default true to avoid flash
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const handleInstallPrompt = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handleInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            // Load Privacy Mode
            const storedPrivacy = localStorage.getItem('isPrivacyMode');
            if (storedPrivacy) setIsPrivacyMode(storedPrivacy === 'true');

            try {
                // Fetch basic data
                const res = await fetch('/api/data');
                const data = res.ok ? await res.json() : null;

                // Fetch cards
                const resCards = await fetch('/api/cards');
                const dataCards = resCards.ok ? await resCards.json() : [];

                // Fetch Preferences (isSetupCompleted)
                const resPref = await fetch('/api/user/preferences');
                const dataPref = resPref.ok ? await resPref.json() : null;

                if (data) {
                    if (data.categories.length === 0 && data.wallets.length === 0) {
                        await fetch('/api/seed', { method: 'POST' });
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
                }

                if (dataCards) {
                    setSavedCards(dataCards);
                }

                if (dataPref) {
                    // If isSetupCompleted explicitly false or undefined in DB, it will be false here if we logic correctly.
                    // But init state is true.
                    // If new user, dataPref.isSetupCompleted is false (default).
                    setIsSetupCompleted(!!dataPref.isSetupCompleted);
                }
            } catch (error) {
                console.error("Error loading data:", error);
            }
            setIsLoaded(true);
        };
        loadData();
    }, []);

    // Calculate Alerts based on Per-Wallet Limits
    useEffect(() => {
        if (!isLoaded) return;

        const newNotifications: Notification[] = [];
        const now = new Date();
        const startDay = startOfDay(now);
        const startWk = startOfWeek(now);
        const startMth = startOfMonth(now);

        wallets.forEach(wallet => {
            const limits = wallet.expenseLimits;
            if (!limits) return;

            // Filter transactions for this wallet
            const walletTx = transactions.filter(t => t.walletId === wallet.id && t.type === 'expense');

            const dailyExpense = walletTx
                .filter(t => isAfter(new Date(t.date), startDay))
                .reduce((acc, t) => acc + t.amount, 0);

            const weeklyExpense = walletTx
                .filter(t => isAfter(new Date(t.date), startWk))
                .reduce((acc, t) => acc + t.amount, 0);

            const monthlyExpense = walletTx
                .filter(t => isAfter(new Date(t.date), startMth))
                .reduce((acc, t) => acc + t.amount, 0);

            if (limits.daily > 0 && dailyExpense > limits.daily) {
                newNotifications.push({
                    id: `limit-daily-${wallet.id}`,
                    type: 'limit-daily',
                    message: `${wallet.name}: Daily limit exceeded (${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(limits.daily)})`,
                    date: now.toISOString(),
                    read: false,
                });
            }

            if (limits.weekly > 0 && weeklyExpense > limits.weekly) {
                newNotifications.push({
                    id: `limit-weekly-${wallet.id}`,
                    type: 'limit-weekly',
                    message: `${wallet.name}: Weekly limit exceeded (${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(limits.weekly)})`,
                    date: now.toISOString(),
                    read: false,
                });
            }

            if (limits.monthly > 0 && monthlyExpense > limits.monthly) {
                newNotifications.push({
                    id: `limit-monthly-${wallet.id}`,
                    type: 'limit-monthly',
                    message: `${wallet.name}: Monthly limit exceeded (${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(limits.monthly)})`,
                    date: now.toISOString(),
                    read: false,
                });
            }
        });

        setNotifications(newNotifications);
    }, [transactions, wallets, isLoaded]);

    const addTransaction = async (t: Omit<Transaction, 'id'>) => {
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

        try {
            await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTransaction),
            });
        } catch (error) {
            console.error("Error saving transaction:", error);
        }
    };

    const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
        const oldTransaction = transactions.find(tx => tx.id === id);
        if (!oldTransaction) return;

        const updatedTransaction = { ...oldTransaction, ...updates };
        setTransactions(prev => prev.map(tx => tx.id === id ? updatedTransaction : tx));

        // Logic update wallet balance
        if (updates.amount !== undefined || updates.type !== undefined || updates.walletId !== undefined) {
            setWallets(prev => prev.map(w => {
                if (w.id === oldTransaction.walletId) {
                    const revertedBalance = oldTransaction.type === 'income'
                        ? w.balance - oldTransaction.amount
                        : w.balance + oldTransaction.amount;

                    if (w.id === updatedTransaction.walletId) {
                        return {
                            ...w,
                            balance: updatedTransaction.type === 'income'
                                ? revertedBalance + updatedTransaction.amount
                                : revertedBalance - updatedTransaction.amount
                        };
                    }
                    return { ...w, balance: revertedBalance };
                }
                if (w.id === updatedTransaction.walletId) {
                    return {
                        ...w,
                        balance: updatedTransaction.type === 'income'
                            ? w.balance + updatedTransaction.amount
                            : w.balance - updatedTransaction.amount
                    };
                }
                return w;
            }));
        }

        try {
            const res = await fetch(`/api/transactions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTransaction),
            });
            if (!res.ok) {
                const res2 = await fetch('/api/data');
                const data = await res2.json();
                setTransactions(data.transactions);
                setWallets(data.wallets);
            }
        } catch (error) {
            console.error("Error updating transaction:", error);
        }
    };

    const deleteTransaction = async (id: string) => {
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

        try {
            await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    const getWalletBalance = (id: string) => {
        return wallets.find(w => w.id === id)?.balance || 0;
    };

    const addWallet = async (walletData: Omit<Wallet, 'id' | 'userId'>) => {
        const newWallet = { ...walletData, id: crypto.randomUUID() };
        setWallets(prev => [newWallet, ...prev]);

        try {
            const res = await fetch('/api/wallets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newWallet),
            });
            if (!res.ok) {
                setWallets(prev => prev.filter(w => w.id !== newWallet.id));
            }
        } catch (error) {
            console.error("Error creating wallet:", error);
            setWallets(prev => prev.filter(w => w.id !== newWallet.id));
        }
    };

    const updateWallet = async (id: string, updates: Partial<Wallet>) => {
        setWallets(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
        try {
            const res = await fetch(`/api/wallets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!res.ok) {
                const res2 = await fetch('/api/data');
                const data = await res2.json();
                setWallets(data.wallets);
            }
        } catch (error) {
            console.error("Error updating wallet:", error);
        }
    };

    const deleteWallet = async (id: string) => {
        setWallets(prev => prev.filter(w => w.id !== id));
        try {
            await fetch(`/api/wallets/${id}`, { method: 'DELETE' });
        } catch (error) {
            console.error("Error deleting wallet:", error);
            const res = await fetch('/api/data');
            const data = await res.json();
            setWallets(data.wallets);
        }
    };

    const markNotificationRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const addCard = async (cardData: Omit<SavedCard, 'id' | 'userId'>) => {
        const newCard = { ...cardData, id: crypto.randomUUID(), userId: '' } as SavedCard; // UserId handled by backend
        setSavedCards(prev => [...prev, newCard]);

        try {
            const res = await fetch('/api/cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...cardData, id: newCard.id }),
            });
            if (!res.ok) {
                setSavedCards(prev => prev.filter(c => c.id !== newCard.id));
            }
        } catch (error) {
            console.error("Error creating card:", error);
            setSavedCards(prev => prev.filter(c => c.id !== newCard.id));
        }
    };

    const updateCard = async (id: string, updates: Partial<SavedCard>) => {
        setSavedCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
        try {
            await fetch(`/api/cards/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
        } catch (error) {
            console.error("Error updating card:", error);
        }
    };

    const deleteCard = async (id: string) => {
        setSavedCards(prev => prev.filter(c => c.id !== id));
        try {
            await fetch(`/api/cards/${id}`, { method: 'DELETE' });
        } catch (error) {
            console.error("Error deleting card:", error);
            // Revert on error
            const res = await fetch('/api/cards');
            const data = await res.json();
            setSavedCards(data);
        }
    };

    const togglePrivacyMode = () => {
        setIsPrivacyMode(prev => {
            const next = !prev;
            localStorage.setItem('isPrivacyMode', String(next));
            return next;
        });
    };

    const completeSetup = async () => {
        setIsSetupCompleted(true);
        try {
            await fetch('/api/user/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isSetupCompleted: true }),
            });
        } catch (error) {
            console.error("Error completing setup:", error);
        }
    };

    const totalBalance = wallets.reduce((acc, curr) => acc + curr.balance, 0);

    return (
        <StoreContext.Provider value={{
            transactions,
            wallets,
            categories,
            notifications,
            savedCards,
            addTransaction,
            updateTransaction,
            deleteTransaction,
            getWalletBalance,
            totalBalance,
            addWallet,
            updateWallet,
            deleteWallet,
            markNotificationRead,
            addCard,
            updateCard,
            deleteCard,
            isPrivacyMode,
            togglePrivacyMode,
            isSetupCompleted,
            completeSetup,
            installPrompt
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
