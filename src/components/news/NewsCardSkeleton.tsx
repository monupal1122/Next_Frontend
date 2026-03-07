"use client";

import { NewsCard } from "./NewsCard";

interface NewsCardSkeletonProps {
    variant?: "default" | "featured" | "horizontal" | "compact";
}

export function NewsCardSkeleton({ variant = "default" }: NewsCardSkeletonProps) {
    if (variant === "horizontal" || variant === "compact") {
        return (
            <div className="flex gap-3 p-3 bg-white rounded-2xl border border-zinc-100 animate-pulse">
                <div className="flex-shrink-0 rounded-xl bg-zinc-200 w-24 h-20 sm:w-32 sm:h-24 md:w-36 md:h-26" />
                <div className="flex flex-col justify-center flex-1 gap-2">
                    <div className="h-3 bg-zinc-200 rounded w-1/4" />
                    <div className="h-4 bg-zinc-200 rounded w-full" />
                    <div className="h-4 bg-zinc-200 rounded w-2/3" />
                    <div className="h-3 bg-zinc-200 rounded w-1/3 mt-1" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden animate-pulse">
            <div className="aspect-video bg-zinc-200 m-2 rounded-xl" />
            <div className="p-3 space-y-3">
                <div className="h-5 bg-zinc-200 rounded w-full" />
                <div className="h-5 bg-zinc-200 rounded w-4/5" />
                <div className="h-4 bg-zinc-200 rounded w-2/3 mt-4" />
                <div className="h-3 bg-zinc-200 rounded w-1/2" />
            </div>
        </div>
    );
}
