"use client";

import { Modal } from "./Modal";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = false,
    isLoading = false
}: ConfirmModalProps) {
    const footer = (
        <>
            <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-secondary/20 text-muted-foreground rounded-xl font-semibold hover:bg-secondary/40 transition-colors border border-white/5"
            >
                {cancelText}
            </button>
            <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isDestructive
                    ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
                    }`}
            >
                {isLoading ? (
                    <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                    </>
                ) : (
                    confirmText
                )}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={footer}
        >
            <div className="flex flex-col items-center text-center p-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDestructive ? "bg-rose-500/10 text-rose-500" : "bg-yellow-500/10 text-yellow-500"
                    }`}>
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                    {message}
                </p>
            </div>
        </Modal>
    );
}
