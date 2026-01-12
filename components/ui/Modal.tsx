"use client"
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export function Modal({ isOpen, onClose, title, children, footer, className }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Prevent body scroll when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;
    if (!isOpen) return null;

    // Use portal to render outside the DOM hierarchy (solves z-index stacking context issues)
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Backdrop Click to Close */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Modal Content */}
            {/* Modal Content */}
            <div className={cn(
                "w-full max-w-md flex flex-col bg-card/95 backdrop-blur-2xl border border-border rounded-[32px] shadow-2xl overflow-hidden relative z-10 max-h-[90vh] animate-in slide-in-from-bottom-5 duration-300",
                className
            )}>
                {/* Header */}
                <div className="bg-secondary/20 border-b border-border p-6 flex items-center justify-between shrink-0 shadow-lg shadow-black/5">
                    <h2 className="text-xl font-bold bg-clip-text text-foreground">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-secondary/50 transition-colors border border-border/50 hover:border-border active:scale-95"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar flex-1 relative">
                    {children}
                </div>

                {/* Footer - Fixed at bottom */}
                {footer && (
                    <div className="bg-secondary/20 border-t border-border p-6 flex gap-3 shrink-0 backdrop-blur-xl z-20">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
