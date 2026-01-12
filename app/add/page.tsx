"use client"

import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Camera, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

export default function AddTransaction() {
    const { categories, wallets, addTransaction } = useStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedWallet, setSelectedWallet] = useState('');

    const [uploading, setUploading] = useState(false);
    const [receiptUrl, setReceiptUrl] = useState<string | undefined>(undefined);

    // Set default wallet
    useEffect(() => {
        if (wallets.length > 0 && !selectedWallet) {
            const active = wallets.find(w => !w.isFrozen);
            if (active) setSelectedWallet(active.id);
        }
    }, [wallets, selectedWallet]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                setReceiptUrl(data.url);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !selectedWallet || !selectedCategory) return;

        try {
            await addTransaction({
                type: activeTab,
                amount: Number(amount),
                categoryId: selectedCategory,
                walletId: selectedWallet,
                date: new Date(date).toISOString(),
                note,
                receiptUrl
            });
            router.push('/');
        } catch (error) {
            console.error("Failed to add transaction", error);
        }
    };

    const filteredCategories = categories.filter(c => c.type === activeTab);

    return (
        <div className="min-h-screen bg-background pb-32 pt-6 px-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold">Add Transaction</h1>
            </div>

            {/* Type Selector */}
            <div className="flex p-1 bg-secondary/30 rounded-2xl mb-8">
                {(['expense', 'income'] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveTab(type)}
                        className={cn(
                            "flex-1 py-3 rounded-xl text-sm font-semibold capitalize transition-all",
                            activeTab === type
                                ? type === 'expense' ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                                    : "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Amount Input */}
                <div>
                    <label className="block text-sm font-semibold mb-3 text-muted-foreground">Amount</label>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground group-focus-within:text-primary transition-colors">Rp</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-secondary/50 border border-white/5 rounded-2xl text-4xl font-bold pl-14 py-6 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/20 transition-all"
                            placeholder="0"
                            autoFocus
                            required
                        />
                    </div>
                </div>

                {/* Category Grid */}
                <div>
                    <label className="block text-sm font-semibold mb-3 text-muted-foreground">Category</label>
                    <div className="grid grid-cols-4 gap-3">
                        {filteredCategories.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setSelectedCategory(cat.id)}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all active:scale-95",
                                    selectedCategory === cat.id
                                        ? "bg-secondary border-primary/50 ring-2 ring-primary/20"
                                        : "bg-secondary/20 border-transparent hover:bg-secondary/40"
                                )}
                            >
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform text-2xl", cat.color, selectedCategory === cat.id && "scale-110")}>
                                    <Icon name={cat.icon} className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-medium truncate w-full text-center text-muted-foreground">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-muted-foreground">Wallet</label>
                        <select
                            value={selectedWallet}
                            onChange={(e) => setSelectedWallet(e.target.value)}
                            className="w-full p-4 rounded-xl bg-secondary/50 border border-white/10 focus:border-primary focus:outline-none appearance-none font-medium"
                        >
                            {wallets.map(wallet => (
                                <option key={wallet.id} value={wallet.id} className="text-black" disabled={wallet.isFrozen}>
                                    {wallet.name} {wallet.isFrozen ? '(Frozen)' : `(${new Intl.NumberFormat('id-ID', { compactDisplay: "short", notation: "compact" }).format(wallet.balance)})`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-muted-foreground">Date</label>
                            <input
                                type="datetime-local"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-4 rounded-xl bg-secondary/50 border border-white/10 focus:border-primary focus:outline-none font-medium min-h-[58px]"
                            />
                        </div>
                        {/* Receipt Upload */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-muted-foreground">Receipt</label>
                            <div className="relative">
                                <label className={cn(
                                    "flex items-center justify-center w-full h-[58px] rounded-xl border border-dashed border-white/10 bg-secondary/20 cursor-pointer hover:bg-secondary/30 transition-all",
                                    (uploading || wallets.find(w => w.id === selectedWallet)?.isFrozen) ? "opacity-50 cursor-not-allowed" : ""
                                )}>
                                    {receiptUrl ? (
                                        <div className="flex items-center gap-2 text-emerald-500 font-medium text-sm">
                                            <Check className="w-4 h-4" />
                                            Uploaded
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                            <Camera className="w-4 h-4" />
                                            <span>{uploading ? "..." : "Add Photo"}</span>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading || !!wallets.find(w => w.id === selectedWallet)?.isFrozen} />
                                </label>
                                {receiptUrl && (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); setReceiptUrl(undefined); }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-muted-foreground">Note (Optional)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full p-4 rounded-xl bg-secondary/50 border border-white/10 focus:border-primary focus:outline-none resize-none min-h-[100px]"
                            placeholder="Add a note..."
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={cn(
                        "w-full py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2",
                        activeTab === 'expense' ? "bg-rose-500 shadow-rose-500/25 hover:bg-rose-600" :
                            "bg-emerald-500 shadow-emerald-500/25 hover:bg-emerald-600"
                    )}
                >
                    <Check className="w-6 h-6" />
                    Save Transaction
                </button>
            </form>
        </div>
    );
}
