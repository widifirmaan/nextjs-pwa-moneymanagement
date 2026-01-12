"use client"
import { useStore } from "@/context/StoreContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownLeft, Bell, Wallet as WalletIcon, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

export default function Home() {
  const { totalBalance, wallets, transactions, categories } = useStore();

  const recentTransactions = transactions.slice(0, 10);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const getCategory = (id: string) => categories.find(c => c.id === id);

  const calculateTotal = (type: 'income' | 'expense') => {
    return transactions
      .filter(t => t.type === type)
      .reduce((acc, curr) => acc + curr.amount, 0);
  }

  return (
    <div className="p-6 space-y-8 pt-10 min-h-screen pb-28 md:pb-10 md:pt-8 md:max-w-6xl md:mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center animate-in slide-in-from-top-5 duration-500">
        <div>
          <p className="text-muted-foreground text-sm font-medium">Good Morning,</p>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">Widifirmaan</h1>
        </div>
        <button className="p-2.5 rounded-full bg-secondary/50 border border-white/5 hover:bg-secondary transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Balance & Wallets */}
        <div className="md:col-span-2 space-y-8">
          {/* Balance Card */}
          <div className="animate-in zoom-in-95 duration-500 delay-100">
            <div className="relative overflow-hidden rounded-3xl p-6 md:p-10 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 shadow-2xl shadow-indigo-500/20 ring-1 ring-white/10">
              <div className="absolute -top-12 -right-12 p-4 opacity-10 rotate-12">
                <WalletIcon className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <p className="text-indigo-100/80 mb-1 font-medium text-base">Total Balance</p>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">{formatCurrency(totalBalance)}</h2>

                <div className="flex gap-4 max-w-md">
                  <div className="flex-1 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/5">
                    <div className="p-2 bg-emerald-500/20 rounded-full">
                      <ArrowDownLeft className="w-4 h-4 text-emerald-300" />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-300 font-medium uppercase tracking-wider">Income</p>
                      <p className="text-sm font-bold text-white">{formatCurrency(calculateTotal('income'))}</p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/5">
                    <div className="p-2 bg-rose-500/20 rounded-full">
                      <ArrowUpRight className="w-4 h-4 text-rose-300" />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-300 font-medium uppercase tracking-wider">Expense</p>
                      <p className="text-sm font-bold text-white">{formatCurrency(calculateTotal('expense'))}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wallets */}
          <div className="space-y-4 animate-in slide-in-from-bottom-5 duration-500 delay-200">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-lg font-bold tracking-tight">My Wallets</h3>
              <Link href="/wallets" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">View All</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:pb-0 snap-x">
              {wallets.map(wallet => (
                <div key={wallet.id} className={cn("snap-start min-w-[160px] p-5 rounded-3xl flex flex-col justify-between h-36 relative overflow-hidden transition-transform hover:scale-95 active:scale-95", wallet.color)}>
                  <div className="absolute -right-6 -bottom-6 opacity-20 rotate-12">
                    <WalletIcon className="w-24 h-24 text-white" />
                  </div>
                  <div className="relative z-10">
                    <span className="text-white/90 font-semibold text-sm block mb-1">{wallet.name}</span>
                    <span className="text-white/60 text-[10px] uppercase tracking-wider border border-white/20 px-2 py-0.5 rounded-full inline-block">{wallet.type}</span>
                  </div>
                  <span className="text-white font-bold text-lg relative z-10 truncate">{formatCurrency(wallet.balance).split(',')[0]}</span>
                </div>
              ))}
              <div className="snap-start min-w-[60px] md:min-w-0 md:h-36 flex items-center justify-center">
                <button className="w-14 h-14 rounded-full border-2 border-dashed border-zinc-700 hover:border-zinc-500 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors">
                  <MoreHorizontal className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Transactions */}
        <div className="space-y-4 animate-in slide-in-from-bottom-10 duration-500 delay-300 pb-20 md:pb-0">
          <h3 className="text-lg font-bold tracking-tight px-1">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map((t, i) => {
              const cat = getCategory(t.categoryId);
              return (
                <GlassCard key={t.id} className="flex items-center justify-between p-4 hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", cat?.color)}>
                      <Icon name={cat?.icon || 'Circle'} className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{cat?.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{t.note}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("font-bold text-base", t.type === 'income' ? 'text-emerald-500' : 'text-rose-500')}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount).split(',')[0]}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">{format(new Date(t.date), 'dd MMM, HH:mm')}</p>
                  </div>
                </GlassCard>
              );
            })}
            {recentTransactions.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <p>No transactions yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
