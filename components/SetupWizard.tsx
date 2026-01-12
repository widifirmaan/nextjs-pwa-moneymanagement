"use client"

import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, CreditCard, ArrowRight, Check, Smartphone, ShieldCheck, ChevronRight, Plus, X, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./ui/GlassCard";

export function SetupWizard() {
    const { isSetupCompleted, completeSetup, wallets, updateWallet, addWallet, addCard, installPrompt } = useStore();
    const [step, setStep] = useState(1);

    // Initial Wallet State (usually Cash w1)
    const [cashBalance, setCashBalance] = useState(0);
    const [hasSetBalance, setHasSetBalance] = useState(false);

    // Limits State
    const [selectedWalletId, setSelectedWalletId] = useState<string>('');
    const [limits, setLimits] = useState({ daily: 0, weekly: 0, monthly: 0 });

    // Card State
    const [cardData, setCardData] = useState({
        cardName: "",
        cardHolderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        color: "bg-blue-600",
        cardType: "visa" as any
    });

    useEffect(() => {
        const cashWallet = wallets.find(w => w.type === 'cash');
        if (cashWallet) {
            setCashBalance(cashWallet.balance);
            setSelectedWalletId(cashWallet.id);
        }
    }, [wallets]);



    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev - 1);

    const saveWalletBalance = async () => {
        const cashWallet = wallets.find(w => w.type === 'cash');
        if (cashWallet) {
            await updateWallet(cashWallet.id, { balance: cashBalance });
        }
        setHasSetBalance(true);
        handleNext();
    };

    const saveLimits = async () => {
        if (selectedWalletId) {
            await updateWallet(selectedWalletId, { expenseLimits: limits });
        }
        handleNext();
    };

    const saveCard = async () => {
        if (cardData.cardNumber) {
            await addCard({
                ...cardData,
                bankName: "Unknown"
            });
        }
        handleNext();
    };

    const handleInstallClick = async () => {
        if (installPrompt) {
            installPrompt.prompt();
            const { outcome } = await installPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
        }
    };

    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                new Notification("Notifications Enabled", { body: "You will receive alerts for expense limits." });
            }
        }
        handleNext();
    };

    const finishSetup = async () => {
        await completeSetup();
    };

    if (isSetupCompleted) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl" />

            <GlassCard className="w-full max-w-lg min-h-[500px] flex flex-col relative overflow-hidden shadow-2xl border-white/10">
                {/* Progress Bar */}
                <div className="h-1 bg-secondary w-full">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 6) * 100}%` }}
                    />
                </div>

                <div className="p-8 flex-1 flex flex-col relative z-20">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col items-center text-center justify-center space-y-6"
                            >
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
                                    <ShieldCheck className="w-12 h-12 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">Welcome to MoneW</h1>
                                    <p className="text-muted-foreground">Let's set up your personal finance dashboard in a few simple steps.</p>
                                </div>
                                <button onClick={handleNext} className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold mt-8 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                                    Get Started
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col space-y-6"
                            >
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                                        <Wallet className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Setup Cash Wallet</h2>
                                    <p className="text-sm text-muted-foreground">How much cash do you currently have?</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase text-muted-foreground ml-1">Current Balance</label>
                                    <div className="flex items-center justify-center gap-2 border-b border-border focus-within:border-primary transition-colors py-2">
                                        <span className="text-4xl font-bold text-muted-foreground">Rp</span>
                                        <input
                                            type="number"
                                            value={cashBalance || ''}
                                            onChange={(e) => setCashBalance(Number(e.target.value))}
                                            className="w-full text-4xl font-bold bg-transparent focus:outline-none"
                                            placeholder="0"
                                            inputMode="numeric"
                                        />
                                    </div>
                                </div>

                                <button onClick={saveWalletBalance} className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold mt-auto shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                                    Continue
                                </button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col space-y-6"
                            >
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
                                        <ShieldCheck className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Set Spending Limits</h2>
                                    <p className="text-sm text-muted-foreground">Control your spending for your Cash wallet.</p>
                                </div>

                                <div className="space-y-4">
                                    {['Daily', 'Weekly', 'Monthly'].map(period => (
                                        <div key={period}>
                                            <label className="text-xs font-medium uppercase text-muted-foreground ml-1">{period} Limit</label>
                                            <input
                                                type="number"
                                                value={(limits as any)[period.toLowerCase()]}
                                                onChange={(e) => setLimits(prev => ({ ...prev, [period.toLowerCase()]: Number(e.target.value) }))}
                                                className="w-full p-3 bg-secondary rounded-xl font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                                                placeholder="0 (No Limit)"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto flex gap-3">
                                    <button onClick={handleNext} className="flex-1 py-3 text-muted-foreground hover:text-foreground">Skip</button>
                                    <button onClick={saveLimits} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20">Save</button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col space-y-6"
                            >
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4">
                                        <CreditCard className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Add a Card</h2>
                                    <p className="text-sm text-muted-foreground">Optional: Add a debit/credit card.</p>
                                </div>

                                <div className="space-y-4">
                                    <input placeholder="Card Name (e.g. Genius)" value={cardData.cardName} onChange={e => setCardData({ ...cardData, cardName: e.target.value })} className="w-full p-3 bg-secondary rounded-xl" />
                                    <input placeholder="Card Number" value={cardData.cardNumber} onChange={e => setCardData({ ...cardData, cardNumber: e.target.value })} className="w-full p-3 bg-secondary rounded-xl" />
                                    <div className="flex gap-2">
                                        <input placeholder="MM/YY" value={cardData.expiryDate} onChange={e => setCardData({ ...cardData, expiryDate: e.target.value })} className="w-1/2 p-3 bg-secondary rounded-xl" />
                                        <input placeholder="CVV" value={cardData.cvv} onChange={e => setCardData({ ...cardData, cvv: e.target.value })} className="w-1/2 p-3 bg-secondary rounded-xl" />
                                    </div>
                                    <input placeholder="Holder Name" value={cardData.cardHolderName} onChange={e => setCardData({ ...cardData, cardHolderName: e.target.value })} className="w-full p-3 bg-secondary rounded-xl" />
                                </div>

                                <div className="mt-auto flex gap-3">
                                    <button onClick={handleNext} className="flex-1 py-3 text-muted-foreground hover:text-foreground">Skip</button>
                                    <button onClick={saveCard} disabled={!cardData.cardNumber} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50">Add Card</button>
                                </div>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col space-y-6"
                            >
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-4">
                                        <Bell className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Enable Notifications</h2>
                                    <p className="text-sm text-muted-foreground">Stay updated when you reach your spending limits.</p>
                                </div>

                                <div className="bg-secondary/30 p-6 rounded-2xl border border-white/5 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Real-time Safety</p>
                                            <p className="text-xs text-muted-foreground">Get alerted immediately if a transaction exceeds your limit.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                            <Bell className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Smart Reminders</p>
                                            <p className="text-xs text-muted-foreground">Never lose track of your financial health.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto flex gap-3">
                                    <button onClick={handleNext} className="flex-1 py-3 text-muted-foreground hover:text-foreground">Skip</button>
                                    <button onClick={requestNotificationPermission} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20">Enable Notifications</button>
                                </div>
                            </motion.div>
                        )}

                        {step === 6 && (
                            <motion.div
                                key="step6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col space-y-6"
                            >
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                                        <Smartphone className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Install App</h2>
                                    <p className="text-sm text-muted-foreground">For the best experience, install MoneW to your home screen.</p>
                                </div>

                                <div className="space-y-6 bg-secondary/30 p-4 rounded-2xl border border-white/5">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">1</div>
                                        <div>
                                            <p className="font-semibold text-sm">iOS (Safari)</p>
                                            <p className="text-xs text-muted-foreground mt-1">Tap <span className="inline-block px-1 bg-white/10 rounded">Share</span> button, then "Add to Home Screen".</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">2</div>
                                        <div>
                                            <p className="font-semibold text-sm">Android (Chrome)</p>
                                            <p className="text-xs text-muted-foreground mt-1">Tap <span className="inline-block px-1 bg-white/10 rounded">Menu (⋮)</span> button, then "Install App" or "Add to Home Screen".</p>
                                        </div>
                                    </div>
                                </div>

                                {installPrompt && (
                                    <button onClick={handleInstallClick} className="w-full py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl font-bold hover:bg-blue-600/30 transition-colors">
                                        Install Now
                                    </button>
                                )}

                                <button onClick={finishSetup} className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold mt-auto shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                                    Finish Setup <Check className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </GlassCard >
        </div >
    );
}
