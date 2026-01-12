"use client"

import { useState, useEffect } from 'react';
import { X, Download, Share, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function InstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) return;

        // Check if user dismissed before
        const dismissed = localStorage.getItem('install-prompt-dismissed');
        const dismissedTime = dismissed ? parseInt(dismissed) : 0;
        const daysSinceDismiss = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

        // Show again after 7 days
        if (dismissed && daysSinceDismiss < 7) return;

        // Detect platform
        const userAgent = window.navigator.userAgent.toLowerCase();
        const ios = /iphone|ipad|ipod/.test(userAgent);
        const android = /android/.test(userAgent);

        setIsIOS(ios);
        setIsAndroid(android);

        // For Chrome/Edge (beforeinstallprompt)
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // For iOS Safari (show after 3 seconds)
        if (ios && !isStandalone) {
            const timer = setTimeout(() => {
                setShowPrompt(true);
            }, 3000);
            return () => clearTimeout(timer);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                setShowPrompt(false);
            }
            setDeferredPrompt(null);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('install-prompt-dismissed', Date.now().toString());
    };

    if (!showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-[90] pointer-events-auto"
            >
                <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="p-5">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
                                <span className="text-2xl font-bold text-primary-foreground">M</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-foreground text-base mb-1">Install MoneW</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Get quick access and a better experience
                                </p>
                            </div>
                        </div>

                        {/* iOS Instructions */}
                        {isIOS && (
                            <div className="space-y-3 mb-4">
                                <div className="flex items-start gap-3 text-xs">
                                    <div className="mt-0.5 p-1.5 rounded-lg bg-blue-500/10 text-blue-500 flex-shrink-0">
                                        <Share className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-muted-foreground">
                                            1. Tap the <span className="font-semibold text-foreground">Share</span> button below
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 text-xs">
                                    <div className="mt-0.5 p-1.5 rounded-lg bg-green-500/10 text-green-500 flex-shrink-0">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-muted-foreground">
                                            2. Select <span className="font-semibold text-foreground">"Add to Home Screen"</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Android/Chrome Button */}
                        {!isIOS && deferredPrompt && (
                            <button
                                onClick={handleInstallClick}
                                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Install App
                            </button>
                        )}

                        {/* Dismiss link */}
                        <button
                            onClick={handleDismiss}
                            className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Not now
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
