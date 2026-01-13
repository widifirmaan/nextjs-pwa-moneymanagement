"use client"

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface IOSDatePickerProps {
    label?: string;
    value: Date;
    onChange: (date: Date) => void;
    includeTime?: boolean;
    minDate?: Date;
    maxDate?: Date;
}

export function IOSDatePicker({
    label,
    value,
    onChange,
    includeTime = false,
    minDate,
    maxDate
}: IOSDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    // Sync temp value when opening
    useEffect(() => {
        if (isOpen) {
            setTempValue(value);
        }
    }, [isOpen, value]);

    const handleSave = () => {
        onChange(tempValue);
        setIsOpen(false);
    };

    const displayValue = useMemo(() => {
        if (includeTime) {
            return format(value, "dd MMM yyyy, HH:mm");
        }
        return format(value, "dd MMM yyyy");
    }, [value, includeTime]);

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-semibold mb-2 text-muted-foreground">{label}</label>}

            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-full p-4 rounded-xl bg-secondary/50 border border-white/10 hover:bg-secondary/70 hover:border-white/20 transition-all flex items-center justify-between group active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        {includeTime ? <Clock className="w-5 h-5" /> : <CalendarIcon className="w-5 h-5" />}
                    </div>
                    <span className="font-medium text-lg">{displayValue}</span>
                </div>
                {/* Chevron or indicator could go here */}
            </button>

            <DatePickerDrawer
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                value={tempValue}
                onChange={setTempValue}
                onSave={handleSave}
                includeTime={includeTime}
            />
        </div>
    );
}

interface DatePickerDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    value: Date;
    onChange: (date: Date) => void;
    onSave: () => void;
    includeTime: boolean;
}

function DatePickerDrawer({ isOpen, onClose, value, onChange, onSave, includeTime }: DatePickerDrawerProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 z-[101] bg-[#1C1C1E] rounded-t-[32px] border-t border-white/10 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
                    >
                        {/* Handle Bar */}
                        <div className="w-full flex justify-center pt-3 pb-2" onClick={onClose}>
                            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                        </div>

                        {/* Header */}
                        <div className="px-6 pb-4 flex items-center justify-between border-b border-white/5">
                            <button
                                onClick={onClose}
                                className="text-muted-foreground hover:text-white transition-colors text-sm font-medium px-4 py-2"
                            >
                                Cancel
                            </button>
                            <span className="font-bold text-lg">Select Date</span>
                            <button
                                onClick={onSave}
                                className="text-primary hover:text-primary/80 transition-colors text-sm font-bold px-4 py-2"
                            >
                                Done
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 bg-[#1C1C1E]">
                            <DateTimeWheelPicker value={value} onChange={onChange} includeTime={includeTime} />
                        </div>

                        <div className="pb-10 bg-[#1C1C1E]"></div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}

// ----------------------------------------------------------------------
// Wheel Picker Implementation
// ----------------------------------------------------------------------

function DateTimeWheelPicker({ value, onChange, includeTime }: { value: Date, onChange: (d: Date) => void, includeTime: boolean }) {

    // Generate arrays
    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);
    }, []);

    const months = useMemo(() => [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ], []);

    const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
    const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
    const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

    const updateDate = (type: 'year' | 'month' | 'day' | 'hour' | 'minute', val: number) => {
        const newDate = new Date(value);
        if (type === 'year') newDate.setFullYear(val);
        if (type === 'month') newDate.setMonth(val);
        if (type === 'day') newDate.setDate(val);
        if (type === 'hour') newDate.setHours(val);
        if (type === 'minute') newDate.setMinutes(val);
        onChange(newDate);
    };

    return (
        <div className="flex justify-center items-center gap-1 h-[250px] relative">

            {/* Selection Highlight - Absolute center */}
            <div className="absolute inset-x-0 h-[40px] bg-white/10 rounded-lg pointer-events-none z-0 top-1/2 -translate-y-1/2 border-y border-white/5" />

            {/* Date Columns */}
            <div className="flex-1 flex gap-1 h-full z-10">
                <WheelColumn
                    items={days}
                    selectedValue={value.getDate()}
                    onSelect={(v) => updateDate('day', v)}
                    formatItem={(v) => v.toString()}
                />
                <WheelColumn
                    items={months.map((m, i) => ({ value: i, label: m }))}
                    selectedValue={value.getMonth()}
                    onSelect={(v) => updateDate('month', v)}
                    formatItem={(v) => v.label.substring(0, 3)}
                    width="w-20"
                />
                <WheelColumn
                    items={years}
                    selectedValue={value.getFullYear()}
                    onSelect={(v) => updateDate('year', v)}
                    formatItem={(v) => v.toString()}
                />
            </div>

            {includeTime && (
                <>
                    <div className="w-[1px] h-[150px] bg-white/10 mx-2" />
                    <div className="flex-[0.8] flex gap-1 h-full z-10">
                        <WheelColumn
                            items={hours}
                            selectedValue={value.getHours()}
                            onSelect={(v) => updateDate('hour', v)}
                            formatItem={(v) => v.toString().padStart(2, '0')}
                        />
                        <div className="flex items-center justify-center pt-2 font-bold text-white/50">:</div>
                        <WheelColumn
                            items={minutes}
                            selectedValue={value.getMinutes()}
                            onSelect={(v) => updateDate('minute', v)}
                            formatItem={(v) => v.toString().padStart(2, '0')}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

interface WheelColumnProps<T> {
    items: T[];
    selectedValue: number;
    onSelect: (value: any) => void;
    formatItem: (item: T) => string;
    width?: string;
}

function WheelColumn<T>({ items, selectedValue, onSelect, formatItem, width = "flex-1" }: WheelColumnProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const ITEM_HEIGHT = 40;

    // Scroll to selected value on mount
    useEffect(() => {
        if (containerRef.current) {
            let index = -1;
            // Find index of selected value
            if (typeof items[0] === 'object' && items[0] !== null && 'value' in items[0]) {
                index = (items as any[]).findIndex((i: any) => i.value === selectedValue);
            } else {
                index = items.indexOf(selectedValue as any);
            }

            if (index !== -1) {
                containerRef.current.scrollTop = index * ITEM_HEIGHT;
            }
        }
    }, []); // Run once on mount to set initial position

    const handleScroll = () => {
        if (!containerRef.current) return;

        const scrollTop = containerRef.current.scrollTop;
        const index = Math.round(scrollTop / ITEM_HEIGHT);

        if (index >= 0 && index < items.length) {
            const item = items[index];
            if (typeof item === 'object' && item !== null && 'value' in item) {
                // If existing value is different, prevent tight loop if needed, but here simple set is ok
                // We actually want to debounce this or only set on scroll end for perf, but React is fast enough usually
                // To avoid "fighting" the scroll, we might check if value changed
            }
        }
    };

    // Use intersection observer or scroll end listener for actual selection to avoid jitter
    // Ideally, we select when scroll snaps.
    const handleScrollEnd = () => {
        if (!containerRef.current) return;
        const scrollTop = containerRef.current.scrollTop;
        const index = Math.round(scrollTop / ITEM_HEIGHT);
        if (index >= 0 && index < items.length) {
            const item = items[index];
            const val = (typeof item === 'object' && item !== null && 'value' in item) ? (item as any).value : item;
            if (val !== selectedValue) {
                onSelect(val);
            }
        }
    }

    // Determine debounce for scroll 
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let timeout: NodeJS.Timeout;

        const onScroll = () => {
            clearTimeout(timeout);
            timeout = setTimeout(handleScrollEnd, 100);
        };

        el.addEventListener('scroll', onScroll);
        return () => {
            el.removeEventListener('scroll', onScroll);
            clearTimeout(timeout);
        };
    }, [items, selectedValue]);


    return (
        <div
            ref={containerRef}
            className={cn(
                "h-full overflow-y-auto w-full no-scrollbar relative scroll-smooth",
                "snap-y snap-mandatory", // snapped
                width
            )}
            style={{
                scrollPaddingTop: "105px" // Center (250/2 - 40/2) = 125 - 20 = 105
            }}
        >
            <div className="h-[105px]" /> {/* Spacer top */}

            {items.map((item, i) => {
                const val = (typeof item === 'object' && item !== null && 'value' in item) ? (item as any).value : item;
                const isSelected = val === selectedValue;

                return (
                    <div
                        key={i}
                        className={cn(
                            "h-[40px] flex items-center justify-center snap-center transition-all duration-200 cursor-pointer select-none",
                            isSelected ? "text-white font-bold text-lg scale-110" : "text-white/30 text-base scale-95 hover:text-white/50"
                        )}
                        onClick={() => {
                            if (containerRef.current) {
                                containerRef.current.scrollTo({ top: i * ITEM_HEIGHT, behavior: 'smooth' });
                            }
                        }}
                    >
                        {formatItem(item)}
                    </div>
                );
            })}

            <div className="h-[105px]" /> {/* Spacer bottom */}
        </div>
    );
}
