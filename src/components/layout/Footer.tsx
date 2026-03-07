"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Rss,
    Newspaper,
    ArrowRight,
    Search,
} from "lucide-react";
import { getCategories } from "@/lib/api";

export function Footer() {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    return (
        <footer className="bg-zinc-950 text-white pt-16 pb-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* 1. Brand Section */}
                    <div className="space-y-6">
                        <Link href="/">
                            <img
                                src="/logo1.webp"
                                alt="DNV logo"
                                className="h-14 lg:h-18 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs font-medium">
                            Your trusted site for real-time news, breaking headlines, investigative journalism, and local stories from across the globe.
                        </p>
                        {/* Social Icons (Matches Screenshot) */}
                        <div className="flex items-center gap-3 pt-4">
                            {[
                                { Icon: Facebook, href: "#" },
                                { Icon: Youtube, href: "#" },
                                { Icon: Instagram, href: "#" },
                                { Icon: Twitter, href: "#" },
                            ].map(({ Icon, href }, i) => (
                                <Link
                                    key={i}
                                    href={href}
                                    className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-700 text-zinc-400 hover:bg-white hover:text-zinc-950 hover:border-white transition-all duration-300"
                                >
                                    <Icon className="w-5 h-5 fill-current" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* 2. TRENDING NEWS (Matches Screenshot) */}
                    <div>
                        <h3 className="font-black text-sm uppercase tracking-widest text-white mb-8">
                            Trending News
                        </h3>
                        <ul className="grid grid-cols-1 gap-y-3">
                            {["Business", "National", "Sports", "Entertainment", "Punjab", "Technology"].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/category/${item.toLowerCase()}`}
                                        className="text-zinc-400 hover:text-white transition-colors text-sm font-bold block"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. INFORMATION (Matches Screenshot) */}
                    <div>
                        <h3 className="font-black text-sm uppercase tracking-widest text-white mb-8">
                            Information
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: "Home", path: "/" },
                                { label: "About Us", path: "/about" },
                                { label: "Contact Us", path: "/contact" },
                                { label: "Latest News", path: "/feed" },
                                { label: "Politics", path: "/category/politics" },
                                { label: "Privacy Policy", path: "/privacy" },
                                { label: "Term of Service", path: "/terms" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.path}
                                        className="text-zinc-400 hover:text-white transition-colors text-sm font-bold block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 4. STAY UPDATED (Matches Screenshot) */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="font-black text-sm uppercase tracking-widest text-white mb-2">
                                Stay Updated
                            </h3>
                            <p className="text-zinc-500 text-xs font-bold leading-relaxed">
                                Subscribe to Daily News Views for the latest breaking news delivered straight to your inbox.
                            </p>
                        </div>
                        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative overflow-hidden bg-white rounded-md">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-4 bg-white text-zinc-900 text-sm font-bold outline-none placeholder:text-zinc-400"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest text-xs rounded-md shadow-lg shadow-red-600/20 hover:bg-white hover:text-red-600 transition-all flex items-center justify-center"
                            >
                                Get Breaking Alerts
                            </button>
                        </form>
                    </div>
                </div>

                {/* BOTTOM (Matches Screenshot) */}
                <div className="mt-16 pt-8 border-t border-zinc-900 text-center">
                    <p className="text-zinc-600 text-[11px] font-black uppercase tracking-widest">
                        © {new Date().getFullYear()} All rights reserved by{" "}
                        <a
                            href="https://nextgrowthdigital.com"
                            target="_blank"
                            className="text-zinc-400 hover:text-white transition-all underline underline-offset-4"
                        >
                            Next Growth Digital
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
