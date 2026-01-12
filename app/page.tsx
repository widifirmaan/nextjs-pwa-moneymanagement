"use client"

import { useStore } from "@/context/StoreContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon, AlertTriangle, X, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { NotificationsBell } from "@/components/ui/NotificationsBell";
import { SetupWizard } from "@/components/SetupWizard";

export default function Home() {
  const { totalBalance, wallets, transactions, categories, notifications, isPrivacyMode, togglePrivacyMode, dismissNotification } = useStore();

  const recentTransactions = transactions.slice(0, 10);

  const activeLimitAlerts = notifications.filter(n =>
    !n.read &&
    (n.type?.startsWith('limit-'))
  );

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
      <div className="flex justify-between items-end animate-in slide-in-from-top-5 duration-500 mb-6">
        <div>
          <p className="text-white/60 text-sm font-semibold tracking-wide uppercase mb-1">Overview</p>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-sm">Hello, Widifirmaan</h1>
        </div>
        <NotificationsBell />
      </div>

      {/* Limit Alerts */}
      <div className="space-y-3">
        {activeLimitAlerts.map(alert => (
          <div key={alert.id} className="animate-in slide-in-from-top-2 duration-300">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
              <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-rose-500 text-sm">{alert.type === 'limit-daily' ? 'Daily Limit Exceeded' : alert.type === 'limit-weekly' ? 'Weekly Limit Exceeded' : 'Monthly Limit Exceeded'}</p>
                <p className="text-xs text-rose-200/80 mt-1">{alert.message}</p>
              </div>
              <button
                onClick={() => dismissNotification(alert.id)}
                className="text-rose-400 hover:text-rose-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {/* Left Column: Balance & Wallets */}
        <div className="md:col-span-2 space-y-10">
          {/* Balance Card */}
          <div className="animate-in zoom-in-95 duration-500 delay-100">
            <GlassCard className="relative overflow-hidden p-8 md:p-12 bg-gradient-to-br from-[#0A84FF] via-[#5E5CE6] to-[#BF5AF2] shadow-2xl shadow-indigo-500/30 ring-1 ring-white/20 group">
              <div className="absolute top-0 right-0 p-12 opacity-20 rotate-12 group-hover:rotate-6 transition-transform duration-700">
                <div className="w-64 h-64 bg-white blur-[80px] rounded-full"></div>
              </div>

              <div className="relative z-10">

                <div className="flex items-center gap-2 mb-2">
                  <p className="text-white/90 font-medium text-lg tracking-wide">Total Net Worth</p>
                  <button onClick={togglePrivacyMode} className="p-1 hover:bg-white/10 rounded-full text-white/70 transition-colors">
                    {isPrivacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-10 tracking-tight">
                  {isPrivacyMode ? '••••••••' : formatCurrency(totalBalance)}
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
                  <div className="flex-1 flex items-center gap-4 bg-black/20 backdrop-blur-xl px-6 py-4 rounded-[24px] border border-white/10 hover:bg-black/30 transition-colors">
                    <div className="p-3 bg-[#32D74B]/20 rounded-full border border-[#32D74B]/30">
                      <ArrowDownLeft className="w-5 h-5 text-[#32D74B]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-white/50 font-bold uppercase tracking-wider mb-0.5">Income</p>
                      <p className="text-lg font-bold text-white">{isPrivacyMode ? '••••••' : formatCurrency(calculateTotal('income'))}</p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-4 bg-black/20 backdrop-blur-xl px-6 py-4 rounded-[24px] border border-white/10 hover:bg-black/30 transition-colors">
                    <div className="p-3 bg-[#FF453A]/20 rounded-full border border-[#FF453A]/30">
                      <ArrowUpRight className="w-5 h-5 text-[#FF453A]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-white/50 font-bold uppercase tracking-wider mb-0.5">Expense</p>
                      <p className="text-lg font-bold text-white">{isPrivacyMode ? '••••••' : formatCurrency(calculateTotal('expense'))}</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Wallets */}
          <div className="space-y-4 animate-in slide-in-from-bottom-5 duration-500 delay-200">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-lg font-bold tracking-tight">My Wallets</h3>
              <Link href="/wallets" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">View All</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:pb-0 snap-x">
              {wallets.map(wallet => (
                <GlassCard key={wallet.id} className={cn("snap-start min-w-[160px] p-5 flex flex-col justify-between h-36 relative overflow-hidden", wallet.color)}>
                  <div className="absolute -right-6 -bottom-6 opacity-20 rotate-12">
                    <WalletIcon className="w-24 h-24 text-white" />
                  </div>
                  <div className="relative z-10">
                    <span className="text-white/90 font-semibold text-sm block mb-1">{wallet.name}</span>
                    <span className="text-white/60 text-[10px] uppercase tracking-wider border border-white/20 px-2 py-0.5 rounded-full inline-block">{wallet.type}</span>
                  </div>
                  <span className="text-white font-bold text-lg relative z-10 truncate">
                    {isPrivacyMode ? '••••••' : formatCurrency(wallet.balance).split(',')[0]}
                  </span>
                </GlassCard>
              ))}
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
                <GlassCard key={t.id} className="p-4 hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer border-white/5">
                  <div className="flex items-start gap-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0", cat?.color)}>
                      <Icon name={cat?.icon || 'Circle'} className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* First Row: Category Name and Amount */}
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="font-bold text-sm text-foreground truncate">{cat?.name}</p>
                        <p className={cn("font-bold text-base whitespace-nowrap flex-shrink-0", t.type === 'income' ? 'text-emerald-500' : 'text-rose-500')}>
                          {t.type === 'income' ? '+' : '-'}{isPrivacyMode ? '••••••' : formatCurrency(t.amount).split(',')[0]}
                        </p>
                      </div>
                      {/* Second Row: Note and Date */}
                      <div className="flex items-baseline justify-between gap-4 mt-0.5">
                        <p className="text-xs text-muted-foreground line-clamp-1">{t.note}</p>
                        <p className="text-[10px] text-muted-foreground font-medium whitespace-nowrap flex-shrink-0">{format(new Date(t.date), 'dd MMM, HH:mm')}</p>
                      </div>
                    </div>
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
      <SetupWizard />
    </div>
  );
}
