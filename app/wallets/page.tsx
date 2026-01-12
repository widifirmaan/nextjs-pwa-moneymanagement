"use client"
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { ArrowLeft, Plus, MoreVertical, Edit, Trash2, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";
import { Wallet as WalletIcon } from "lucide-react";
import { Wallet } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { Modal } from "@/components/ui/Modal";

export default function WalletsPage() {
    const { wallets, addWallet, updateWallet, deleteWallet } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
    const [showMenu, setShowMenu] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        type: "bank" as "bank" | "ewallet" | "cash",
        balance: 0,
        color: "bg-blue-600",
        accountNumber: "",
        expenseLimits: {
            daily: 0,
            weekly: 0,
            monthly: 0,
        }
    });

    const colors = [
        "bg-blue-600",
        "bg-cyan-500",
        "bg-green-600",
        "bg-orange-500",
        "bg-purple-600",
        "bg-pink-500",
        "bg-red-500",
        "bg-indigo-600",
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleOpenModal = (wallet?: Wallet) => {
        if (wallet) {
            setEditingWallet(wallet);
            setFormData({
                name: wallet.name,
                type: wallet.type,
                balance: wallet.balance,
                color: wallet.color,
                accountNumber: wallet.accountNumber || "",
                expenseLimits: wallet.expenseLimits || { daily: 0, weekly: 0, monthly: 0 },
            });
        } else {
            setEditingWallet(null);
            setFormData({
                name: "",
                type: "bank",
                balance: 0,
                color: "bg-blue-600",
                accountNumber: "",
                expenseLimits: { daily: 0, weekly: 0, monthly: 0 },
            });
        }
        setShowModal(true);
        setShowMenu(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingWallet(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check for duplicate name
        const nameExists = wallets.some(w =>
            w.name.trim().toLowerCase() === formData.name.trim().toLowerCase() &&
            w.id !== editingWallet?.id
        );

        if (nameExists) {
            alert("A wallet with this name already exists. Please choose a different name.");
            return;
        }

        setIsSubmitting(true);

        try {
            if (editingWallet) {
                await updateWallet(editingWallet.id, formData);
            } else {
                await addWallet(formData);
            }
            handleCloseModal();
        } catch (error) {
            console.error("Error saving wallet:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isDefaultCash = editingWallet?.type === 'cash' && editingWallet?.name === 'Cash';

    const handleDelete = async (id: string) => {
        const w = wallets.find(w => w.id === id);
        if (w?.type === 'cash' && w?.name === 'Cash') {
            alert("Default Cash wallet cannot be deleted.");
            return;
        }

        if (confirm("Are you sure you want to delete this wallet?")) {
            try {
                await deleteWallet(id);
                setShowMenu(null);
            } catch (error) {
                console.error("Error deleting wallet:", error);
            }
        }
    };

    const handleToggleFreeze = async (wallet: Wallet) => {
        if (wallet.type === 'cash' && wallet.name === 'Cash') {
            return;
        }
        try {
            await updateWallet(wallet.id, { isFrozen: !wallet.isFrozen });
            setShowMenu(null);
        } catch (error) {
            console.error("Error freezing wallet:", error);
        }
    };

    const footerButtons = (
        <>
            <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 px-4 py-3 bg-secondary/20 text-white/70 rounded-xl font-semibold hover:bg-secondary/40 transition-colors border border-white/5 hover:border-white/10"
                disabled={isSubmitting}
            >
                {isDefaultCash ? "Close" : "Cancel"}
            </button>
            <button
                form="wallet-form"
                type="submit"
                disabled={isSubmitting || isDefaultCash}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
                {isSubmitting ? (
                    <>
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                    </>
                ) : (
                    <>{editingWallet ? "Update" : "Add"} Wallet</>
                )}
            </button>
        </>
    );

    return (
        <div className="min-h-screen bg-background pb-32 pt-6 px-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold">My Wallets</h1>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-transform active:scale-95 hover:scale-105"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-4">
                {wallets.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <WalletIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>No wallets yet. Add your first wallet!</p>
                    </div>
                ) : (
                    wallets.map((wallet, i) => (
                        <div key={wallet.id} className="relative">
                            <GlassCard
                                className={cn(
                                    "p-6 rounded-3xl relative overflow-hidden group animate-in slide-in-from-bottom-5 duration-500 fill-mode-backwards",
                                    wallet.color,
                                    wallet.isFrozen && "opacity-60 grayscale"
                                )}
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                {wallet.isFrozen && (
                                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 z-10">
                                        <Snowflake className="w-4 h-4 text-white" />
                                        <span className="text-xs text-white font-medium">Frozen</span>
                                    </div>
                                )}

                                <div className="absolute -right-8 -bottom-8 opacity-20 rotate-12 transition-transform group-hover:scale-110 duration-500">
                                    <WalletIcon className="w-32 h-32 text-white" />
                                </div>

                                <div className="relative z-10 flex flex-col gap-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-white/80 font-medium mb-1">{wallet.name}</p>
                                            <p className="text-white/60 text-xs uppercase tracking-wider bg-black/10 px-2 py-1 rounded-lg inline-block backdrop-blur-sm">
                                                {wallet.type}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowMenu(showMenu === wallet.id ? null : wallet.id);
                                            }}
                                            className="p-1 rounded-full hover:bg-white/10 text-white/80 transition-all hover:scale-110 active:scale-95 relative z-20"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div>
                                        <p className="text-white/60 text-xs mb-1">Balance</p>
                                        <p className="text-white font-bold text-3xl tracking-tight">
                                            {formatCurrency(wallet.balance)}
                                        </p>
                                        {wallet.accountNumber && (
                                            <p className="text-white/40 text-xs mt-2 font-mono">
                                                {wallet.accountNumber}
                                            </p>
                                        )}
                                    </div>
                                    <div className="absolute top-0 right-0 p-12 opacity-20 rotate-12 group-hover:rotate-6 transition-transform duration-700 pointer-events-none">
                                        <div className="w-48 h-48 bg-white blur-[60px] rounded-full"></div>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Dropdown Menu - Outside card overflow */}
                            {showMenu === wallet.id && (
                                <div className="absolute right-6 top-14 bg-background border border-border rounded-xl shadow-2xl min-w-[180px] z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenModal(wallet);
                                        }}
                                        className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3 text-sm"
                                    >
                                        <Edit className="w-4 h-4 text-blue-500" />
                                        {wallet.type === 'cash' && wallet.name === 'Cash' ? "View Details" : "Edit Wallet"}
                                    </button>

                                    {!(wallet.type === 'cash' && wallet.name === 'Cash') && (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleFreeze(wallet);
                                                }}
                                                className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3 text-sm"
                                            >
                                                <Snowflake
                                                    className={cn(
                                                        "w-4 h-4",
                                                        wallet.isFrozen ? "text-orange-500" : "text-cyan-500"
                                                    )}
                                                />
                                                {wallet.isFrozen ? "Unfreeze" : "Freeze"} Wallet
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(wallet.id);
                                                }}
                                                className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3 text-sm text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete Wallet
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={editingWallet ? (isDefaultCash ? "Wallet Details" : "Edit Wallet") : "Add New Wallet"}
                footer={footerButtons}
            >
                <form id="wallet-form" onSubmit={handleSubmit} className="space-y-4">
                    {isDefaultCash && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex gap-3 items-center">
                            <Snowflake className="w-5 h-5 text-yellow-500 shrink-0" />
                            <p className="text-xs text-yellow-500">Default Cash wallet cannot be edited or frozen so that you always have a safe place for your money.</p>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground">Wallet Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-secondary/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-muted-foreground/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="e.g., BCA, GoPay, Cash"
                            required
                            maxLength={50}
                            disabled={isDefaultCash}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    type: e.target.value as "bank" | "ewallet" | "cash",
                                })
                            }
                            className="w-full px-4 py-3 bg-secondary/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary appearance-none text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isDefaultCash}
                        >
                            <option value="bank" className="text-black">Bank</option>
                            <option value="ewallet" className="text-black">E-Wallet</option>
                            <option value="cash" className="text-black">Cash</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground">
                            Initial Balance
                        </label>
                        <input
                            type="number"
                            value={formData.balance}
                            onChange={(e) =>
                                setFormData({ ...formData, balance: Number(e.target.value) })
                            }
                            className="w-full px-4 py-3 bg-secondary/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-muted-foreground/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="0"
                            required
                            min="0"
                            disabled={isDefaultCash}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground">
                            Account Number (Optional)
                        </label>
                        <input
                            type="text"
                            value={formData.accountNumber}
                            onChange={(e) =>
                                setFormData({ ...formData, accountNumber: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-secondary/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-muted-foreground/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="1234567890"
                            maxLength={50}
                            disabled={isDefaultCash}
                        />
                    </div>

                    <div className="space-y-3 pt-2">
                        <p className="text-sm font-medium border-t border-white/10 pt-4 text-muted-foreground">Spending Limits (0 for no limit)</p>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Daily</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.expenseLimits.daily}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        expenseLimits: { ...formData.expenseLimits, daily: Number(e.target.value) }
                                    })}
                                    className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="0"
                                    disabled={isDefaultCash}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Weekly</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.expenseLimits.weekly}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        expenseLimits: { ...formData.expenseLimits, weekly: Number(e.target.value) }
                                    })}
                                    className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="0"
                                    disabled={isDefaultCash}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Monthly</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.expenseLimits.monthly}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        expenseLimits: { ...formData.expenseLimits, monthly: Number(e.target.value) }
                                    })}
                                    className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="0"
                                    disabled={isDefaultCash}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3 text-muted-foreground">Color</label>
                        <div className="grid grid-cols-4 gap-3">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    disabled={isDefaultCash}
                                    className={cn(
                                        "h-12 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                                        color,
                                        formData.color === color
                                            ? "ring-4 ring-primary ring-offset-2 ring-offset-background scale-110"
                                            : "hover:scale-105"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>

            {
                showMenu && (
                    <div
                        className="fixed inset-0 z-[90]"
                        onClick={() => setShowMenu(null)}
                    />
                )
            }
        </div>
    );
}
