"use client"
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { ArrowLeft, Plus, CreditCard, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { SavedCard } from "@/lib/types";

export default function CardsPage() {
    const { savedCards, addCard, updateCard, deleteCard } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [editingCard, setEditingCard] = useState<SavedCard | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

    const [formData, setFormData] = useState<Omit<SavedCard, 'id' | 'userId'>>({
        cardName: "",
        cardHolderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardType: "visa", // default
        color: "from-purple-500 to-indigo-600",
        bankName: ""
    });

    // Card Colors (Gradients)
    const cardColors = [
        { label: "Purple", value: "from-purple-500 to-indigo-600" },
        { label: "Blue", value: "from-blue-500 to-cyan-500" },
        { label: "Emerald", value: "from-emerald-500 to-teal-600" },
        { label: "Rose", value: "from-rose-500 to-pink-600" },
        { label: "Orange", value: "from-orange-500 to-amber-500" },
        { label: "Dark", value: "from-slate-800 to-slate-900" },
        { label: "Gold", value: "from-yellow-400 to-amber-600" },
    ];

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "").substr(0, 16);
        const parts = [];
        for (let i = 0; i < v.length; i += 4) {
            parts.push(v.substr(i, 4));
        }
        return parts.length > 1 ? parts.join(" ") : value;
    };

    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        if (v.length >= 2) {
            return v.substr(0, 2) + "/" + v.substr(2, 2);
        }
        return v;
    };

    const handleOpenModal = (card?: SavedCard) => {
        if (card) {
            setEditingCard(card);
            setFormData({
                cardName: card.cardName,
                cardHolderName: card.cardHolderName,
                cardNumber: card.cardNumber,
                expiryDate: card.expiryDate,
                cvv: card.cvv || "",
                cardType: card.cardType,
                color: card.color,
                bankName: card.bankName || ""
            });
        } else {
            setEditingCard(null);
            setFormData({
                cardName: "",
                cardHolderName: "",
                cardNumber: "",
                expiryDate: "",
                cvv: "",
                cardType: "visa",
                color: "from-purple-500 to-indigo-600",
                bankName: ""
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingCard) {
                await updateCard(editingCard.id, formData);
            } else {
                await addCard(formData);
            }
            setShowModal(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };



    const getCardLogo = (type: string) => {
        switch (type) {
            case 'visa': return "VISA"; // Placeholder, idealnya SVG logo
            case 'mastercard': return "Mastercard";
            case 'amex': return "Amex";
            case 'jcb': return "JCB";
            default: return "Card";
        }
    };

    return (
        <div className="min-h-screen pb-32 pt-6 px-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold">My Cards</h1>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-transform active:scale-95 hover:scale-105"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedCards.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>No cards saved yet. Add your first card safely!</p>
                    </div>
                ) : (
                    savedCards.map((card, i) => (
                        <div key={card.id} className="relative group perspective-1000 h-56 w-full cursor-pointer" onClick={() => handleOpenModal(card)}>
                            <div className={cn(
                                "relative w-full h-full rounded-2xl shadow-xl transition-all duration-500 transform bg-gradient-to-br p-6 text-white overflow-hidden border border-white/10",
                                card.color
                            )}>
                                {/* Liquid Blob Effect */}
                                <div className="absolute top-0 right-0 p-12 opacity-30 pointer-events-none">
                                    <div className="w-48 h-48 bg-white blur-[60px] rounded-full"></div>
                                </div>
                                <div className="absolute bottom-0 left-0 p-8 opacity-20 pointer-events-none">
                                    <div className="w-32 h-32 bg-black blur-[50px] rounded-full"></div>
                                </div>

                                <div className="relative z-10 flex flex-col justify-between h-full">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-lg tracking-wide">{card.bankName || 'Bank Name'}</p>
                                            <p className="text-xs opacity-75">{card.cardName}</p>
                                        </div>
                                        <span className="text-xl font-bold italic">{getCardLogo(card.cardType)}</span>
                                    </div>

                                    <div className="flex items-center justify-center">
                                        {/* Simulating chip */}
                                        <div className="w-12 h-9 bg-yellow-200/80 rounded-md mr-auto mb-2 border border-yellow-400/50 flex items-center justify-center overflow-hidden">
                                            <div className="w-full h-[1px] bg-black/20 my-[2px]"></div>
                                            <div className="absolute w-[1px] h-full bg-black/20 mx-[2px]"></div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="font-mono text-xl tracking-widest drop-shadow-sm mb-4">
                                            {card.cardNumber ? card.cardNumber.replace(/(.{4})/g, "$1 ").trim() : '•••• •••• •••• ••••'}
                                        </p>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] uppercase opacity-60 tracking-wider">Card Holder</p>
                                                <p className="font-medium tracking-wide uppercase truncate max-w-[150px]">{card.cardHolderName || 'YOUR NAME'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase opacity-60 tracking-wider text-right">Expires</p>
                                                <p className="font-medium tracking-wide">{card.expiryDate || 'MM/YY'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-background border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in slide-in-from-bottom-10 duration-300 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-6">
                            {editingCard ? "Edit Card" : "Add New Card"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Card Name (Alias)</label>
                                <input
                                    type="text"
                                    value={formData.cardName}
                                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g., Main Debit, Shopping Card"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Bank / Issuer Name</label>
                                <input
                                    type="text"
                                    value={formData.bankName || ''}
                                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g., BCA, Mandiri"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Type</label>
                                    <select
                                        value={formData.cardType}
                                        onChange={(e) => setFormData({ ...formData, cardType: e.target.value as any })}
                                        className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                    >
                                        <option value="visa">Visa</option>
                                        <option value="mastercard">Master</option>
                                        <option value="jcb">JCB</option>
                                        <option value="amex">Amex</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Expiry</label>
                                    <input
                                        type="text"
                                        value={formData.expiryDate}
                                        onChange={(e) => {
                                            const val = formatExpiryDate(e.target.value);
                                            if (val.length <= 5) setFormData({ ...formData, expiryDate: val });
                                        }}
                                        className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-center"
                                        placeholder="MM/YY"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">CVV</label>
                                    <input
                                        type="password"
                                        value={formData.cvv}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                                            setFormData({ ...formData, cvv: val });
                                        }}
                                        className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-center tracking-widest"
                                        placeholder="***"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Card Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.cardNumber}
                                        onChange={(e) => {
                                            const val = formatCardNumber(e.target.value);
                                            if (val.length <= 19) setFormData({ ...formData, cardNumber: val });
                                        }}
                                        className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                                        placeholder="0000 0000 0000 0000"
                                        required
                                    />
                                    <CreditCard className="absolute right-4 top-3.5 w-5 h-5 text-muted-foreground" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Card Holder Name</label>
                                <input
                                    type="text"
                                    value={formData.cardHolderName}
                                    onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value.toUpperCase() })}
                                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                                    placeholder="YOUR NAME"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-3">Card Color</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {cardColors.map((c) => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color: c.value })}
                                            className={cn(
                                                "h-10 rounded-full transition-all bg-gradient-to-br",
                                                c.value,
                                                formData.color === c.value
                                                    ? "ring-4 ring-primary ring-offset-2 ring-offset-background scale-110"
                                                    : "hover:scale-105"
                                            )}
                                            title={c.label}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-3 bg-secondary text-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? "Saving..." : (editingCard ? "Update Card" : "Add Card")}
                                    </button>
                                </div>

                                {editingCard && (
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (confirm("Are you sure you want to delete this card?")) {
                                                setIsSubmitting(true);
                                                await deleteCard(editingCard.id);
                                                setIsSubmitting(false);
                                                setShowModal(false);
                                            }
                                        }}
                                        className="w-full px-4 py-3 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                                        disabled={isSubmitting}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Card
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
