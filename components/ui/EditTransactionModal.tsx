"use client"

import { useState, useEffect } from "react";
import { Transaction, Category, Wallet } from "@/lib/types";
import { GlassCard } from "./GlassCard";
import { X, Trash2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";
import { format } from "date-fns";

interface EditTransactionModalProps {
    transaction: Transaction | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, updates: Partial<Transaction>) => void;
    onDelete: (id: string) => void;
    categories: Category[];
    wallets: Wallet[];
}

export function EditTransactionModal({
    transaction,
    isOpen,
    onClose,
    onSave,
    onDelete,
    categories,
    wallets
}: EditTransactionModalProps) {
    const [formData, setFormData] = useState<Partial<Transaction>>({});
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (transaction) {
            setFormData({
                type: transaction.type,
                amount: transaction.amount,
                categoryId: transaction.categoryId,
                walletId: transaction.walletId,
                date: transaction.date,
                note: transaction.note,
            });
        }
    }, [transaction]);

    if (!isOpen || !transaction) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(transaction.id, formData);
            onClose();
        } catch (error) {
            console.error("Error saving:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this transaction?")) return;

        setIsDeleting(true);
        try {
            await onDelete(transaction.id);
            onClose();
        } catch (error) {
            console.error("Error deleting:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const currentCategory = categories.find(c => c.id === formData.categoryId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <GlassCard className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-card/95 backdrop-blur-xl border-b border-white/5 p-6 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold">Edit Transaction</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Type Selector */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setFormData({ ...formData, type: 'income' })}
                                className={cn(
                                    "p-4 rounded-xl border-2 transition-all font-semibold",
                                    formData.type === 'income'
                                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                                        : "border-border hover:border-emerald-500/50"
                                )}
                            >
                                Income
                            </button>
                            <button
                                onClick={() => setFormData({ ...formData, type: 'expense' })}
                                className={cn(
                                    "p-4 rounded-xl border-2 transition-all font-semibold",
                                    formData.type === 'expense'
                                        ? "border-rose-500 bg-rose-500/10 text-rose-500"
                                        : "border-border hover:border-rose-500/50"
                                )}
                            >
                                Expense
                            </button>
                        </div>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Amount</label>
                        <input
                            type="number"
                            value={formData.amount || ''}
                            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                            className="w-full p-4 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none text-lg font-bold"
                            placeholder="0"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Category</label>
                        <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                            {categories
                                .filter(cat => cat.type === formData.type)
                                .map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                                        className={cn(
                                            "p-3 rounded-xl border-2 transition-all flex items-center gap-3",
                                            formData.categoryId === cat.id
                                                ? "border-primary bg-primary/10"
                                                : "border-border hover:border-primary/50"
                                        )}
                                    >
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0", cat.color)}>
                                            <Icon name={cat.icon} className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium text-sm truncate">{cat.name}</span>
                                    </button>
                                ))}
                        </div>
                    </div>

                    {/* Wallet */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Wallet</label>
                        <select
                            value={formData.walletId || ''}
                            onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
                            className="w-full p-4 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none"
                        >
                            {wallets.map(wallet => (
                                <option key={wallet.id} value={wallet.id}>
                                    {wallet.name} - {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(wallet.balance)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Date & Time</label>
                        <input
                            type="datetime-local"
                            value={formData.date ? format(new Date(formData.date), "yyyy-MM-dd'T'HH:mm") : ''}
                            onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value).toISOString() })}
                            className="w-full p-4 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none"
                        />
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Note</label>
                        <textarea
                            value={formData.note || ''}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="w-full p-4 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none resize-none"
                            rows={3}
                            placeholder="Add a note..."
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting || isSaving}
                            className="flex-1 p-4 rounded-xl bg-rose-500/10 text-rose-500 font-semibold border border-rose-500/20 hover:bg-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isDeleting ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-5 h-5" />
                                    Delete
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isDeleting || isSaving}
                            className="flex-1 p-4 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white font-semibold shadow-lg shadow-violet-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
