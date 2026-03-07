"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Activity } from 'lucide-react';
import { getHeadlines } from '@/lib/api';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsCardSkeleton } from '@/components/news/NewsCardSkeleton';

export function TrendingSidebar() {
    const [trending, setTrending] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getHeadlines().then(data => {
            setTrending(data.slice(0, 5)); // Matches the 5 slots in the screenshot
            setIsLoading(false);
        }).catch(() => setIsLoading(false));
    }, []);

    return (
        <aside className="bg-white border border-zinc-100 shadow-sm overflow-hidden rounded-2xl">
            {/* Header matches Screenshot perfectly */}
            <div className="bg-zinc-950 text-white p-4.5 flex items-center justify-between border-b border-zinc-800 rounded-t-2xl">
                <div className="flex items-center gap-2.5">
                    <div className="relative">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-ping absolute inset-0" />
                        <div className="w-2 h-2 bg-red-600 rounded-full relative" />
                    </div>
                    <h2 className="text-[13px] font-black uppercase tracking-[0.15em] text-white">Trending Now</h2>
                </div>
                <div className="flex items-center gap-2 bg-zinc-800/80 px-2 py-1 rounded-md border border-white/5">
                    <span className="text-[9px] font-black text-red-500 animate-pulse uppercase tracking-widest">Live</span>
                    <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
                </div>
            </div>

            {/* Content List */}
            <div className="flex flex-col">
                {isLoading ? (
                    <div className="p-3 space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <NewsCardSkeleton key={i} variant="horizontal" />
                        ))}
                    </div>
                ) : trending?.length > 0 ? (
                    <div className="divide-y divide-zinc-50">
                        {trending.map((article) => (
                            <div key={article._id} className="group hover:bg-zinc-50 transition-all duration-300">
                                <NewsCard article={article} variant="horizontal" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-zinc-300">
                        <Activity className="w-8 h-8 mx-auto mb-3 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No Active Streams</p>
                    </div>
                )}
            </div>

            {/* Sidebar Footer Indicator */}
            <div className="bg-zinc-50/80 p-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Stream Updated</span>
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" />
                </div>
            </div>
        </aside>
    );
}
