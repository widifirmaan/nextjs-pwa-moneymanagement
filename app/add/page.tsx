"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { ArrowLeft, Calendar, Check, Camera, Upload, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

export default function AddTransaction() {
    const router = useRouter();
    const { categories, wallets, addTransaction } = useStore();

    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [walletId, setWalletId] = useState(wallets[0]?.id || '');
    const [note, setNote] = useState('');
    const [date, setDate] = useState('');
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
                setPreviewUrl(data.url);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        setDate(new Date().toISOString().split('T')[0]);
    }, []);

    const filteredCategories = categories.filter(c => c.type === type);

    // Set default category
    if (!categoryId && filteredCategories.length > 0) {
        setCategoryId(filteredCategories[0].id);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !categoryId || !walletId) return;

        addTransaction({
            amount: parseFloat(amount),
            type,
            categoryId,
            walletId,
            date: new Date(date).toISOString(),
            note,
            receiptUrl: previewUrl || undefined,
        });

        router.push('/');
    };

    return (
        <div className="min-h-screen bg-background pb-32 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center p-6 gap-4">
                <Link href="/" className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <span className="text-lg font-bold">Add Transaction</span>
            </div>

            <div className="px-6 space-y-6">
                {/* Type Switcher */}
                <div className="grid grid-cols-2 bg-secondary/30 p-1 rounded-2xl">
                    <button
                        className={cn("py-3 rounded-xl text-sm font-semibold transition-all", type === 'expense' ? 'bg-background shadow-lg text-rose-500' : 'text-muted-foreground')}
                        onClick={() => setType('expense')}
                    >
                        Expense
                    </button>
                    <button
                        className={cn("py-3 rounded-xl text-sm font-semibold transition-all", type === 'income' ? 'bg-background shadow-lg text-emerald-500' : 'text-muted-foreground')}
                        onClick={() => setType('income')}
                    >
                        Income
                    </button>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                    <label className="text-xs text-muted-foreground ml-1">Amount</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">Rp</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-transparent text-4xl font-bold pl-14 py-4 focus:outline-none placeholder:text-muted-foreground/30"
                            placeholder="0"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Category Grid */}
                <div className="space-y-3">
                    <label className="text-xs text-muted-foreground ml-1">Category</label>
                    <div className="grid grid-cols-4 gap-3">
                        {filteredCategories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setCategoryId(cat.id)}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
                                    categoryId === cat.id ? "bg-secondary border-primary/50 ring-2 ring-primary/20" : "bg-secondary/20 border-transparent hover:bg-secondary/40"
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

                {/* Wallet & Date */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-muted-foreground ml-1">Wallet</label>
                        <select
                            value={walletId}
                            onChange={(e) => setWalletId(e.target.value)}
                            className="w-full p-4 rounded-xl bg-secondary/30 border border-border appearance-none text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                        >
                            {wallets.map(w => (
                                <option key={w.id} value={w.id} className="text-black">{w.name} ({new Intl.NumberFormat('id-ID', { compactDisplay: "short", notation: "compact" }).format(w.balance)})</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-muted-foreground ml-1">Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-4 rounded-xl bg-secondary/30 border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                            />
                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Note */}
                <div className="space-y-2">
                    <label className="text-xs text-muted-foreground ml-1">Note (Optional)</label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Description for this transaction..."
                        className="w-full p-4 rounded-xl bg-secondary/30 border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 h-24 text-foreground"
                    />
                </div>

                {/* Receipt Upload */}
                <div className="space-y-2">
                    <label className="text-xs text-muted-foreground ml-1">Receipt / Proof</label>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        <label className={cn(
                            "flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-secondary/10 cursor-pointer hover:bg-secondary/20 transition-all",
                            uploading ? "opacity-50 cursor-not-allowed" : ""
                        )}>
                            <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center mb-1 text-muted-foreground">
                                <Camera className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground">Add Photo</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={uploading}
                            />
                        </label>

                        {previewUrl && (
                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border group">
                                <img src={previewUrl} alt="Receipt" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => setPreviewUrl(null)}
                                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <Check className="w-5 h-5" />
                    Save Transaction
                </button>
            </div>
        </div>
    );
}
