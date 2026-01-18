"use client"

import { useStore } from "@/context/StoreContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths, isSameDay } from "date-fns";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { useMemo, useState, useEffect } from "react";
import { EditTransactionModal } from "@/components/ui/EditTransactionModal";
import { Transaction } from "@/lib/types";


export default function StatsPage() {
    const { transactions, categories, wallets, totalBalance, updateTransaction, deleteTransaction } = useStore();
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filters
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [filterWallet, setFilterWallet] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    // Date Range Filter
    const [dateRange, setDateRange] = useState<'thisMonth' | 'lastMonth' | 'last3Months' | 'custom'>('thisMonth');
    const [customStartDate, setCustomStartDate] = useState<string>('');
    const [customEndDate, setCustomEndDate] = useState<string>('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    };

    // Calculate date range based on preset or custom
    const { startDate, endDate } = useMemo(() => {
        const now = new Date();

        switch (dateRange) {
            case 'thisMonth':
                return {
                    startDate: startOfMonth(now),
                    endDate: endOfMonth(now)
                };
            case 'lastMonth':
                const lastMonth = subMonths(now, 1);
                return {
                    startDate: startOfMonth(lastMonth),
                    endDate: endOfMonth(lastMonth)
                };
            case 'last3Months':
                return {
                    startDate: startOfMonth(subMonths(now, 2)),
                    endDate: endOfMonth(now)
                };
            case 'custom':
                if (customStartDate && customEndDate) {
                    return {
                        startDate: new Date(customStartDate),
                        endDate: new Date(customEndDate)
                    };
                }
                // Fallback to this month if custom dates not set
                return {
                    startDate: startOfMonth(now),
                    endDate: endOfMonth(now)
                };
            default:
                return {
                    startDate: startOfMonth(now),
                    endDate: endOfMonth(now)
                };
        }
    }, [dateRange, customStartDate, customEndDate]);

    // Calculate current month stats
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());

    const currentMonthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= startDate && date <= endDate;
    });

    // Filtered transactions for table
    const filteredTransactions = useMemo(() => {
        return currentMonthTransactions.filter(t => {
            // Filter by type
            if (filterType !== 'all' && t.type !== filterType) return false;

            // Filter by wallet
            if (filterWallet !== 'all' && t.walletId !== filterWallet) return false;

            // Filter by category
            if (filterCategory !== 'all' && t.categoryId !== filterCategory) return false;

            return true;
        });
    }, [currentMonthTransactions, filterType, filterWallet, filterCategory]);

    // Pagination logic
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredTransactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(startIndex, endIndex);
    }, [filteredTransactions, currentPage, itemsPerPage]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterType, filterWallet, filterCategory, dateRange, customStartDate, customEndDate]);


    const totalIncome = currentMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = currentMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const savings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    // Calculate previous month stats for comparison
    const previousMonthStart = startOfMonth(subMonths(new Date(), 1));
    const previousMonthEnd = endOfMonth(subMonths(new Date(), 1));

    const previousMonthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= previousMonthStart && date <= previousMonthEnd;
    });

    const previousIncome = previousMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const previousExpense = previousMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const incomeChange = previousIncome > 0 ? ((totalIncome - previousIncome) / previousIncome) * 100 : 0;
    const expenseChange = previousExpense > 0 ? ((totalExpense - previousExpense) / previousExpense) * 100 : 0;

    // Daily spending data for line chart


    // Category breakdown for pie chart
    const categoryData = useMemo(() => {
        const expenseByCategory = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                const category = categories.find(c => c.id === t.categoryId);
                const categoryName = category?.name || 'Unknown';
                const categoryColor = category?.color || 'bg-gray-500';

                if (!acc[categoryName]) {
                    acc[categoryName] = { name: categoryName, value: 0, color: categoryColor };
                }
                acc[categoryName].value += t.amount;
                return acc;
            }, {} as Record<string, { name: string; value: number; color: string }>);

        return Object.values(expenseByCategory)
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [currentMonthTransactions, categories]);

    // Extract color hex from tailwind classes
    const getColorFromClass = (colorClass: string): string => {
        const colorMap: Record<string, string> = {
            'bg-orange-500': '#f97316',
            'bg-blue-500': '#3b82f6',
            'bg-green-500': '#22c55e',
            'bg-purple-500': '#a855f7',
            'bg-pink-500': '#ec4899',
            'bg-red-500': '#ef4444',
            'bg-yellow-500': '#eab308',
            'bg-indigo-500': '#6366f1',
            'bg-teal-500': '#14b8a6',
            'bg-cyan-500': '#06b6d4',
        };
        return colorMap[colorClass] || '#6366f1';
    };

    // Top spending categories
    const topCategories = useMemo(() => {
        return categoryData.slice(0, 3);
    }, [categoryData]);

    return (
        <div className="p-6 md:p-8 xl:p-10 space-y-8 pt-10 min-h-screen pb-28 xl:pb-10 md:pt-8 md:max-w-4xl md:mx-auto xl:max-w-6xl xl:ml-[22rem] xl:mr-8">
            {/* Header */}
            <div className="animate-in slide-in-from-top-5 duration-500 space-y-4">
                <div>
                    <p className="text-muted-foreground text-sm font-semibold tracking-wide uppercase mb-1">Analytics</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary drop-shadow-sm">
                        Financial Overview
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        {format(startDate, 'dd MMM yyyy')} - {format(endDate, 'dd MMM yyyy')}
                    </p>
                </div>

                {/* Date Range Filter */}
                <div className="space-y-3">
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setDateRange('thisMonth')}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                                dateRange === 'thisMonth'
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary hover:bg-secondary/80"
                            )}
                        >
                            This Month
                        </button>
                        <button
                            onClick={() => setDateRange('lastMonth')}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                                dateRange === 'lastMonth'
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary hover:bg-secondary/80"
                            )}
                        >
                            Last Month
                        </button>
                        <button
                            onClick={() => setDateRange('last3Months')}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                                dateRange === 'last3Months'
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary hover:bg-secondary/80"
                            )}
                        >
                            Last 3 Months
                        </button>
                        <button
                            onClick={() => setDateRange('custom')}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                                dateRange === 'custom'
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary hover:bg-secondary/80"
                            )}
                        >
                            Custom Range
                        </button>
                    </div>

                    {/* Custom Date Range Pickers */}
                    {dateRange === 'custom' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-200">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none text-sm"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 animate-in slide-in-from-bottom-5 duration-500 delay-100">
                {/* Total Income */}
                <GlassCard className="p-4 md:p-6 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-10">
                        <ArrowDownLeft className="w-32 h-32 text-emerald-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-xl bg-emerald-500/10">
                                <ArrowDownLeft className="w-6 h-6 text-emerald-500" />
                            </div>
                            {incomeChange !== 0 && (
                                <div className={cn("flex items-center gap-1 text-xs font-semibold", incomeChange > 0 ? "text-emerald-500" : "text-rose-500")}>
                                    {incomeChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {Math.abs(incomeChange).toFixed(1)}%
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground font-medium mb-1">Total Income</p>
                        <p className="text-2xl font-bold text-emerald-500">{formatCurrency(totalIncome)}</p>
                    </div>
                </GlassCard>

                {/* Total Expense */}
                <GlassCard className="p-4 md:p-6 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-10">
                        <ArrowUpRight className="w-32 h-32 text-rose-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-xl bg-rose-500/10">
                                <ArrowUpRight className="w-6 h-6 text-rose-500" />
                            </div>
                            {expenseChange !== 0 && (
                                <div className={cn("flex items-center gap-1 text-xs font-semibold", expenseChange > 0 ? "text-rose-500" : "text-emerald-500")}>
                                    {expenseChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {Math.abs(expenseChange).toFixed(1)}%
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground font-medium mb-1">Total Expense</p>
                        <p className="text-2xl font-bold text-rose-500">{formatCurrency(totalExpense)}</p>
                    </div>
                </GlassCard>
            </div>



            {/* Top Categories */}
            <div className="animate-in slide-in-from-bottom-5 duration-500 delay-300">
                <h3 className="text-lg font-bold mb-4 px-1">Top Spending Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {topCategories.map((cat, index) => {
                        const category = categories.find(c => c.name === cat.name);
                        const percentage = totalExpense > 0 ? (cat.value / totalExpense) * 100 : 0;

                        return (
                            <GlassCard key={cat.name} className="p-4 md:p-5 relative overflow-hidden">
                                <div className="absolute -right-2 -bottom-2 opacity-5">
                                    <div className="text-8xl font-black">#{index + 1}</div>
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0", cat.color)}>
                                            <Icon name={category?.icon || 'Circle'} className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{cat.name}</p>
                                            <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of expenses</p>
                                        </div>
                                    </div>
                                    <p className="text-xl font-bold">{formatCurrency(cat.value)}</p>
                                    {/* Progress Bar */}
                                    <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            </div>

            {/* Transactions Table */}
            <div className="animate-in slide-in-from-bottom-5 duration-500 delay-500">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-lg font-bold">All Transactions</h3>
                    <p className="text-sm text-muted-foreground">{filteredTransactions.length} of {currentMonthTransactions.length} transactions</p>
                </div>

                {/* Filters */}
                <div className="mb-4 space-y-3">
                    {/* Type Filter */}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setFilterType('all')}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                                filterType === 'all'
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary hover:bg-secondary/80"
                            )}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterType('income')}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                                filterType === 'income'
                                    ? "bg-emerald-500 text-white"
                                    : "bg-secondary hover:bg-secondary/80"
                            )}
                        >
                            Income
                        </button>
                        <button
                            onClick={() => setFilterType('expense')}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                                filterType === 'expense'
                                    ? "bg-rose-500 text-white"
                                    : "bg-secondary hover:bg-secondary/80"
                            )}
                        >
                            Expense
                        </button>
                    </div>

                    {/* Wallet & Category Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Wallet Filter */}
                        <select
                            value={filterWallet}
                            onChange={(e) => setFilterWallet(e.target.value)}
                            className="p-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none text-sm"
                        >
                            <option value="all">All Wallets</option>
                            {wallets.map(wallet => (
                                <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
                            ))}
                        </select>

                        {/* Category Filter */}
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="p-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none text-sm"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {filteredTransactions.length > 0 ? (
                    <GlassCard className="overflow-hidden">
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Category</th>
                                        <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Description</th>
                                        <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Date & Time</th>
                                        <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedTransactions
                                        .map((t) => {
                                            const cat = categories.find(c => c.id === t.categoryId);
                                            return (
                                                <tr
                                                    key={t.id}
                                                    onClick={() => {
                                                        setSelectedTransaction(t);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0", cat?.color)}>
                                                                <Icon name={cat?.icon || 'Circle'} className="w-5 h-5" />
                                                            </div>
                                                            <span className="font-medium text-sm">{cat?.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="text-sm text-muted-foreground">{t.note || '-'}</span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium">{format(new Date(t.date), 'dd MMM yyyy')}</span>
                                                            <span className="text-xs text-muted-foreground">{format(new Date(t.date), 'HH:mm')}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <span className={cn("text-base font-bold", t.type === 'income' ? 'text-emerald-500' : 'text-rose-500')}>
                                                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount).split(',')[0]}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-white/5">
                            {paginatedTransactions
                                .map((t) => {
                                    const cat = categories.find(c => c.id === t.categoryId);
                                    return (
                                        <div
                                            key={t.id}
                                            onClick={() => {
                                                setSelectedTransaction(t);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0", cat?.color)}>
                                                    <Icon name={cat?.icon || 'Circle'} className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    {/* First Row: Category Name and Amount */}
                                                    <div className="flex items-baseline justify-between gap-4">
                                                        <p className="font-bold text-sm text-foreground truncate">{cat?.name}</p>
                                                        <p className={cn("font-bold text-base whitespace-nowrap flex-shrink-0", t.type === 'income' ? 'text-emerald-500' : 'text-rose-500')}>
                                                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount).split(',')[0]}
                                                        </p>
                                                    </div>
                                                    {/* Second Row: Note and Date */}
                                                    <div className="flex items-baseline justify-between gap-4 mt-0.5">
                                                        <p className="text-xs text-muted-foreground line-clamp-1">{t.note || '-'}</p>
                                                        <p className="text-[10px] text-muted-foreground font-medium whitespace-nowrap flex-shrink-0">
                                                            {format(new Date(t.date), 'dd MMM, HH:mm')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </GlassCard>
                ) : (
                    <GlassCard className="p-12 text-center">
                        <p className="text-muted-foreground">No transactions this month</p>
                    </GlassCard>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                        >
                            Previous
                        </button>
                        <span className="text-sm font-medium text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Edit Transaction Modal */}
            <EditTransactionModal
                transaction={selectedTransaction}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTransaction(null);
                }}
                onSave={updateTransaction}
                onDelete={deleteTransaction}
                categories={categories}
                wallets={wallets}
            />
        </div>
    );
}
