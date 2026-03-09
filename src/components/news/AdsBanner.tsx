"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getAds } from "@/lib/api";
import { toAbsoluteUrl } from "@/lib/utils";

interface Ad {
    _id: string;
    title: string;
    imageUrl: string;
    redirectUrl: string;
    placement: string; // 'sidebar', 'content', 'top', etc.
}

interface AdsBannerProps {
    position: 'sidebar' | 'content' | 'top' | 'hero' | 'header'; // Adjusted to match schema common values
    className?: string;
    initialAds?: Ad[];
}

export function AdsBanner({ position, className, initialAds = [] }: AdsBannerProps) {
    // Map Frontend position to Backend placement if different
    const placementMap: Record<string, string> = {
        'sidebar': 'sidebar',
        'content': 'inline', // 'inline' or 'rectangle' in schema
        'top': 'header'
    };

    const targetPlacement = placementMap[position] || position;

    const [ads, setAds] = useState<Ad[]>(initialAds.filter(ad => ad.placement === targetPlacement));

    const [loading, setLoading] = useState(initialAds.length === 0);

    useEffect(() => {
        // Only fetch if initialAds is empty
        if (initialAds.length === 0) {
            getAds().then((data) => {
                const filtered = data.filter((ad: Ad) => ad.placement === targetPlacement);
                setAds(filtered);
                setLoading(false);
            }).catch(() => setLoading(false));
        } else {
            setAds(initialAds.filter(ad => ad.placement === targetPlacement));
            setLoading(false);
        }
    }, [targetPlacement, initialAds]);

    if (loading) return (
        <div className={`bg-zinc-100 animate-pulse rounded-2xl ${position === 'sidebar' ? 'aspect-square' : 'h-32'} ${className}`} />
    );

    if (ads.length === 0) {
        return null; // Remove dummy ads
    }

    // Show the latest ad for this position
    const activeAd = ads[0];

    return (
        <a
            href={activeAd.redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative block overflow-hidden rounded-2xl shadow-xl group border border-zinc-100 ${position === 'sidebar' ? 'aspect-square' : 'h-32'} ${className}`}
        >
            <Image
                src={toAbsoluteUrl(activeAd.imageUrl)}
                alt={activeAd.title}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-[10s]"
            />
            <div className="absolute top-2 right-2 z-10">
                <span className="bg-black/60 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-sm">Ad</span>
            </div>
        </a>
    );
}
