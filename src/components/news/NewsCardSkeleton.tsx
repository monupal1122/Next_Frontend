"use client";

import { NewsCard } from "./NewsCard";

interface NewsCardSkeletonProps {
    variant?: "default" | "featured" | "horizontal" | "compact";
}

export function NewsCardSkeleton({ variant = "default" }: NewsCardSkeletonProps) {
    if (variant === "horizontal" || variant === "compact") {
        return (
            <div className="flex gap-4 p-4 bg-white rounded-xl border border-zinc-100 animate-pulse w-full">
                <div className="flex-shrink-0 rounded-xl bg-zinc-200 w-24 h-20 sm:w-32 sm:h-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
                <div className="flex flex-col justify-center flex-1 gap-2.5">
                    <div className="h-3 bg-zinc-100 rounded w-1/4" />
                    <div className="h-4 bg-zinc-200 rounded w-full" />
                    <div className="h-4 bg-zinc-200 rounded w-4/5" />
                    <div className="h-3 bg-zinc-100 rounded w-1/3 mt-1" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden animate-pulse w-full">
            <div className="aspect-video bg-zinc-200 m-2 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
            <div className="p-4 space-y-4">
                <div className="h-6 bg-zinc-200 rounded w-full" />
                <div className="h-6 bg-zinc-200 rounded w-2/3" />
                <div className="h-4 bg-zinc-100 rounded w-full mt-4" />
                <div className="h-4 bg-zinc-100 rounded w-1/2" />
            </div>
        </div>
    );
}
