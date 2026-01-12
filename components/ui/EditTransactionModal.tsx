"use client"

import { useState, useEffect } from "react";
import { Transaction, Category, Wallet } from "@/lib/types";
import { Trash2, Save, Camera, X, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";
import { format } from "date-fns";
import { Modal } from "./Modal";

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
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (transaction) {
            setFormData({
                type: transaction.type,
                amount: transaction.amount,
                categoryId: transaction.categoryId,
                walletId: transaction.walletId,
                date: transaction.date,
                note: transaction.note,
                receiptUrl: transaction.receiptUrl
            });
            setPreviewUrl(transaction.receiptUrl || null);
        }
    }, [transaction]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData
            });
            const data = await res.json();
            if (data.url) {
                setPreviewUrl(data.url);
                setFormData(prev => ({ ...prev, receiptUrl: data.url }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    if (!transaction) return null;

    const currentWallet = wallets.find(w => w.id === transaction.walletId);
    const isFrozen = currentWallet?.isFrozen;

    const handleSave = async () => {
        if (isFrozen) return;
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
        if (isFrozen) return;
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

    const footerButtons = (
        <>
            <button
                onClick={handleDelete}
                disabled={isDeleting || isSaving || isFrozen}
                className="flex-1 p-4 rounded-xl bg-rose-500/10 text-rose-500 font-semibold border border-rose-500/20 hover:bg-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isDeleting || isSaving || isFrozen}
                className="flex-1 p-4 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white font-semibold shadow-lg shadow-violet-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        Save
                    </>
                )}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Transaction"
            footer={footerButtons}
        >
            <div className="space-y-6">
                {isFrozen && (
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 flex gap-3 items-center">
                        <Snowflake className="w-5 h-5 text-cyan-500 shrink-0" />
                        <p className="text-xs text-cyan-500">
                            This transaction belongs to a <b>Frozen Wallet</b> ({currentWallet?.name}). Unfreeze the wallet to edit or delete this transaction.
                        </p>
                    </div>
                )}

                {/* Type Selector */}
                <div>
                    <label className="block text-sm font-semibold mb-3 text-muted-foreground">Type</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setFormData({ ...formData, type: 'income' })}
                            disabled={isFrozen}
                            className={cn(
                                "p-4 rounded-xl border-2 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed",
                                formData.type === 'income'
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                                    : "border-white/10 hover:border-emerald-500/50"
                            )}
                        >
                            Income
                        </button>
                        <button
                            onClick={() => setFormData({ ...formData, type: 'expense' })}
                            disabled={isFrozen}
                            className={cn(
                                "p-4 rounded-xl border-2 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed",
                                formData.type === 'expense'
                                    ? "border-rose-500 bg-rose-500/10 text-rose-500"
                                    : "border-white/10 hover:border-rose-500/50"
                            )}
                        >
                            Expense
                        </button>
                    </div>
                </div>

                {/* Amount */}
                <div>
                    <label className="block text-sm font-semibold mb-3 text-muted-foreground">Amount</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">Rp</span>
                        <input
                            type="number"
                            value={formData.amount || ''}
                            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                            disabled={isFrozen}
                            className="w-full bg-secondary/50 border border-white/10 rounded-xl text-3xl font-bold pl-14 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-muted-foreground/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-semibold mb-3 text-muted-foreground">Category</label>
                    <div className="grid grid-cols-4 gap-3">
                        {categories
                            .filter(cat => cat.type === formData.type)
                            .map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                                    disabled={isFrozen}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                                        formData.categoryId === cat.id
                                            ? "bg-secondary border-primary/50 ring-2 ring-primary/20"
                                            : "bg-secondary/20 border-transparent hover:bg-secondary/40"
                                    )}
                                >
                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white", cat.color)}>
                                        <Icon name={cat.icon} className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-medium truncate w-full text-center text-muted-foreground">{cat.name}</span>
                                </button>
                            ))}
                    </div>
                </div>

                {/* Wallet */}
                <div>
                    <label className="block text-sm font-semibold mb-3 text-muted-foreground">Wallet</label>
                    <select
                        value={formData.walletId || ''}
                        onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
                        disabled={isFrozen}
                        className="w-full p-4 rounded-xl bg-secondary/50 border border-white/10 focus:border-primary focus:outline-none appearance-none font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {wallets.map(wallet => (
                            <option key={wallet.id} value={wallet.id} className="text-black" disabled={wallet.isFrozen && wallet.id !== formData.walletId}>
                                {wallet.name} {wallet.isFrozen ? '(Frozen)' : `(${new Intl.NumberFormat('id-ID', { compactDisplay: "short", notation: "compact" }).format(wallet.balance)})`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-semibold mb-3 text-muted-foreground">Date & Time</label>
                    <input
                        type="datetime-local"
                        value={formData.date ? format(new Date(formData.date), "yyyy-MM-dd'T'HH:mm") : ''}
                        onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value).toISOString() })}
                        disabled={isFrozen}
                        className="w-full p-4 rounded-xl bg-secondary/50 border border-white/10 focus:border-primary focus:outline-none font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                {/* Note */}
                <div>
                    <label className="block text-sm font-semibold mb-3 text-muted-foreground">Note</label>
                    <textarea
                        value={formData.note || ''}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        disabled={isFrozen}
                        className="w-full p-4 rounded-xl bg-secondary/50 border border-white/10 focus:border-primary focus:outline-none resize-none text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        rows={3}
                        placeholder="Add a note..."
                    />
                </div>

                {/* Receipt Upload */}
                <div>
                    <label className="block text-sm font-semibold mb-3 text-muted-foreground">Receipt / Proof</label>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        <label className={cn(
                            "flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 border-dashed border-white/10 bg-secondary/10 cursor-pointer hover:bg-secondary/20 transition-all",
                            (uploading || isFrozen) ? "opacity-50 cursor-not-allowed" : ""
                        )}>
                            <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center mb-1 text-muted-foreground">
                                <Camera className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground">Edit Photo</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={uploading || isFrozen}
                            />
                        </label>

                        {previewUrl && (
                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/10 group">
                                <img src={previewUrl} alt="Receipt" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => {
                                        if (isFrozen) return;
                                        setPreviewUrl(null);
                                        setFormData(prev => ({ ...prev, receiptUrl: undefined }));
                                    }}
                                    disabled={isFrozen}
                                    className={cn(
                                        "absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white transition-opacity",
                                        isFrozen ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                                    )}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
