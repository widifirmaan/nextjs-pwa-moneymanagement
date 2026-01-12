"use client"

import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { GlassCard } from './GlassCard';

export function NotificationsBell() {
    const { notifications, markNotificationRead } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;
    // Sort notifications by date (newest first)
    const sortedNotifications = [...notifications].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md"
            >
                <Bell className="w-6 h-6 text-white" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-black" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 animate-in slide-in-from-top-2 duration-200">
                    <GlassCard className="p-0 overflow-hidden shadow-2xl bg-black/80 backdrop-blur-xl border-white/10">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <h3 className="font-semibold text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="text-xs text-rose-500 font-medium bg-rose-500/10 px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto">
                            {sortedNotifications.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {sortedNotifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={cn(
                                                "p-4 transition-colors hover:bg-white/5",
                                                !notification.read ? "bg-white/[0.02]" : "opacity-60"
                                            )}
                                        >
                                            <div className="flex gap-3">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                                                    !notification.read ? "bg-rose-500" : "bg-white/20"
                                                )} />
                                                <div className="flex-1 space-y-1">
                                                    <p className={cn("text-sm", !notification.read && "font-semibold")}>
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(new Date(notification.date), 'dd MMM, HH:mm')}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            markNotificationRead(notification.id);
                                                        }}
                                                        className="p-1 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white transition-colors self-start"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-muted-foreground">
                                    <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    );
}
