"use client"
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { ArrowLeft, Plus, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Wallet as WalletIcon } from "lucide-react";

export default function WalletsPage() {
    const { wallets } = useStore();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="min-h-screen bg-background pb-32 pt-6 px-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold">My Wallets</h1>
                </div>
                <button className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-transform active:scale-95">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-4">
                {wallets.map((wallet, i) => (
                    <div key={wallet.id} className={cn("p-6 rounded-3xl relative overflow-hidden group animate-in slide-in-from-bottom-5 duration-500 fill-mode-backwards shadow-xl", wallet.color)} style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="absolute -right-8 -bottom-8 opacity-20 rotate-12 transition-transform group-hover:scale-110 duration-500">
                            <WalletIcon className="w-32 h-32 text-white" />
                        </div>

                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-white/80 font-medium mb-1">{wallet.name}</p>
                                    <p className="text-white/60 text-xs uppercase tracking-wider bg-black/10 px-2 py-1 rounded-lg inline-block backdrop-blur-sm">{wallet.type}</p>
                                </div>
                                <button className="p-1 rounded-full hover:bg-white/10 text-white/80">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            <div>
                                <p className="text-white/60 text-xs mb-1">Balance</p>
                                <p className="text-white font-bold text-3xl tracking-tight">{formatCurrency(wallet.balance)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
