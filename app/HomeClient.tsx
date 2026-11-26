"use client"

import { useStore } from "@/context/StoreContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon, AlertTriangle, X, Eye, EyeOff, Edit, Trash2, Snowflake } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Wallet } from "@/lib/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { NotificationsBell } from "@/components/ui/NotificationsBell";
import { SetupWizard } from "@/components/SetupWizard";

export default function Home() {
  const { totalBalance, wallets, transactions, categories, notifications, isPrivacyMode, togglePrivacyMode, dismissNotification, userName, addWallet, updateWallet, deleteWallet } = useStore();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'transactions'>('details');
  const [formData, setFormData] = useState({
    name: "", type: "bank" as "bank" | "ewallet" | "cash", balance: 0, color: "bg-blue-600", accountNumber: "",
    expenseLimits: { daily: 0, weekly: 0, monthly: 0 }
  });

  const colors = ["bg-blue-600", "bg-cyan-500", "bg-green-600", "bg-orange-500", "bg-purple-600", "bg-pink-500", "bg-red-500", "bg-indigo-600"];

  const handleOpenModal = (wallet?: Wallet) => {
    if (wallet) {
      setEditingWallet(wallet);
      setFormData({
        name: wallet.name, type: wallet.type, balance: wallet.balance, color: wallet.color,
        accountNumber: wallet.accountNumber || "", expenseLimits: wallet.expenseLimits || { daily: 0, weekly: 0, monthly: 0 },
      });
    } else {
      setEditingWallet(null);
      setFormData({ name: "", type: "bank", balance: 0, color: "bg-blue-600", accountNumber: "", expenseLimits: { daily: 0, weekly: 0, monthly: 0 } });
    }
    setActiveTab('details');
    setShowModal(true);
  };

  const handleCloseModal = () => { setShowModal(false); setEditingWallet(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameExists = wallets.some(w => w.name.trim().toLowerCase() === formData.name.trim().toLowerCase() && w.id !== editingWallet?.id);
    if (nameExists) { alert("Wallet name exists."); return; }
    setIsSubmitting(true);
    try {
      if (editingWallet) await updateWallet(editingWallet.id, formData);
      else await addWallet(formData);
      handleCloseModal();
    } catch (error) { console.error(error); } finally { setIsSubmitting(false); }
  };

  const isDefaultCash = editingWallet?.type === 'cash' && editingWallet?.name === 'Cash';
  const walletTransactions = editingWallet ? transactions.filter(t => t.walletId === editingWallet.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];

  const recentTransactions = transactions.slice(0, 5);

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
    <div className="p-6 md:p-8 xl:p-10 space-y-8 pt-10 min-h-screen pb-28 xl:pb-10 md:pt-8 md:max-w-4xl md:mx-auto xl:max-w-6xl xl:ml-[22rem] xl:mr-8">
      {/* Header */}
      <div className="flex justify-between items-end animate-in slide-in-from-top-5 duration-500 mb-6 gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-sm font-semibold tracking-wide uppercase mb-1">Overview</p>
          <h1
            className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary drop-shadow-sm truncate"
            title={userName || 'User'}
          >
            Hello, {userName || 'User'}
          </h1>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 xl:gap-10">
        {/* Left Column: Balance & Wallets */}
        <div className="md:col-span-2 space-y-10">
          {/* Balance Card */}
          <div className="animate-in zoom-in-95 duration-500 delay-100">
            <GlassCard className="relative overflow-hidden p-8 md:p-10 xl:p-12 bg-gradient-to-br from-[#0A84FF] via-[#5E5CE6] to-[#BF5AF2] shadow-2xl shadow-indigo-500/30 ring-1 ring-white/20 group">
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
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-8 md:mb-10 tracking-tight truncate">
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold tracking-tight">My Wallets</h3>
              <Link href="/wallets" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">View All</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2 md:mx-0 md:px-0 md:overflow-visible md:grid md:grid-cols-2 md:gap-4 md:pb-0 xl:grid-cols-3 md:snap-none snap-x">
              {wallets.map(wallet => (
                <GlassCard key={wallet.id} onClick={() => handleOpenModal(wallet)} className={cn("snap-start min-w-[160px] p-5 flex flex-col justify-between h-36 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform shadow-lg", wallet.color)}>
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
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="text-lg font-bold tracking-tight">Recent Transactions</h3>
            <Link href="/stats" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">View All</Link>
          </div>
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
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={isDefaultCash ? "Wallet Details" : "Edit Wallet"}
        footer={
          activeTab === 'details' ? (
            <>
              {!isDefaultCash && (
                <button type="button" onClick={async () => {
                  if (confirm("Delete wallet?")) {
                    await deleteWallet(editingWallet!.id);
                    handleCloseModal();
                  }
                }} className="mr-auto px-4 py-3 bg-rose-500/10 text-rose-500 rounded-xl font-semibold hover:bg-rose-500/20 text-sm flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              )}
              <button type="button" onClick={handleCloseModal} className="px-4 py-3 bg-secondary/20 text-white/70 rounded-xl font-semibold hover:bg-secondary/40 text-sm">Cancel</button>
              <button onClick={handleSubmit} disabled={isSubmitting || isDefaultCash} className="px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/20 text-sm">
                {isSubmitting ? "Saving..." : "Update"}
              </button>
            </>
          ) : (
            <button type="button" onClick={handleCloseModal} className="w-full px-4 py-3 bg-secondary/20 text-white/70 rounded-xl font-semibold hover:bg-secondary/40 text-sm">Close</button>
          )
        }
      >
        {editingWallet && (
          <div className="flex gap-2 mb-6 bg-secondary/30 p-1 rounded-xl">
            <button className={cn("flex-1 py-2.5 rounded-lg text-sm font-bold transition-all", activeTab === 'details' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-white')} onClick={() => setActiveTab('details')}>Details</button>
            <button className={cn("flex-1 py-2.5 rounded-lg text-sm font-bold transition-all", activeTab === 'transactions' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-white')} onClick={() => setActiveTab('transactions')}>Transactions</button>
          </div>
        )}

        {activeTab === 'details' ? (
          <form className="space-y-4">
            {isDefaultCash && <div className="bg-yellow-500/10 p-3 rounded-xl text-yellow-500 text-xs flex gap-2"><Snowflake className="w-4 h-4" /> Default wallet cannot be edited.</div>}
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">Name</label>
              <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 bg-secondary/50 rounded-xl border border-white/10" disabled={isDefaultCash} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">Balance</label>
              <input type="number" value={formData.balance} onChange={e => setFormData({ ...formData, balance: Number(e.target.value) })} className="w-full p-3 bg-secondary/50 rounded-xl border border-white/10" disabled={isDefaultCash} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">Account Number</label>
              <input value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} className="w-full p-3 bg-secondary/50 rounded-xl border border-white/10" disabled={isDefaultCash} placeholder="Optional" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">Color</label>
              <div className="grid grid-cols-4 gap-2">
                {colors.map(c => (
                  <button key={c} type="button" onClick={() => setFormData({ ...formData, color: c })} className={cn("h-10 rounded-lg", c, formData.color === c && "ring-2 ring-white scale-110")} disabled={isDefaultCash} />
                ))}
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {walletTransactions.length === 0 ? <p className="text-center text-muted-foreground py-10">No transactions.</p> : walletTransactions.map(t => (
              <div key={t.id} className="flex justify-between p-3 bg-secondary/30 rounded-xl">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{categories.find(c => c.id === t.categoryId)?.name || 'Unknown'}</span>
                  <span className="text-xs text-muted-foreground">{format(new Date(t.date), 'dd MMM')}</span>
                </div>
                <span className={t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}>{t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
      <SetupWizard />
    </div>
  );
}
