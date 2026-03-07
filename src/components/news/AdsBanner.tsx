"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getAds } from "@/lib/api";
import { toAbsoluteUrl } from "@/lib/utils";

interface Ad {
    _id: string;
    title: string;
    image: string;
    link: string;
    position: string; // 'sidebar', 'content', 'top'
}

interface AdsBannerProps {
    position: 'sidebar' | 'content' | 'top';
    className?: string;
}

export function AdsBanner({ position, className }: AdsBannerProps) {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAds().then((data) => {
            const filtered = data.filter((ad: Ad) => ad.position === position);
            setAds(filtered);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [position]);

    if (loading) return (
        <div className={`bg-zinc-100 animate-pulse rounded-2xl ${position === 'sidebar' ? 'aspect-square' : 'h-32'} ${className}`} />
    );

    if (ads.length === 0) {
        // Fallback Mock Ad if no real ads match the position (matches your screenshot style)
        return (
            <div className={`relative overflow-hidden rounded-2xl shadow-xl group cursor-pointer border border-zinc-100 ${position === 'sidebar' ? 'aspect-square' : 'h-32'} ${className}`}>
                <img
                    src={position === 'sidebar'
                        ? "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop"
                        : "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop"}
                    alt="Advertisement"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-600/90 via-red-600/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="bg-white text-red-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit mb-2">Sponsored</span>
                    <h4 className="text-xl font-black uppercase italic tracking-tighter leading-none mb-1">Mega Sale</h4>
                    <p className="text-[10px] font-bold opacity-80">Up to 70% Off Latest Gadgets.</p>
                </div>
            </div>
        );
    }

    // Show the latest ad for this position
    const activeAd = ads[0];

    return (
        <a
            href={activeAd.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative block overflow-hidden rounded-2xl shadow-xl group border border-zinc-100 ${position === 'sidebar' ? 'aspect-square' : 'h-32'} ${className}`}
        >
            <Image
                src={toAbsoluteUrl(activeAd.image)}
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
