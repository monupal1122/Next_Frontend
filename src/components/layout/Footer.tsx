"use client";

import Link from "next/link";
import { Facebook, Youtube, Instagram, Twitter, ArrowRight } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-zinc-950 text-white pt-12 md:pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                {/* Top Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">

                    {/* 1. Brand */}
                    <div className="space-y-5 sm:col-span-2 lg:col-span-1">
                        <Link href="/">
                            <img src="/logo1.webp" alt="DNV logo" className="h-10 md:h-12 w-auto object-contain brightness-0 invert" />
                        </Link>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs font-medium">
                            Your trusted source for real-time news, breaking headlines, investigative journalism, and local stories from across the globe.
                        </p>
                        {/* Social Icons */}
                        <div className="flex items-center gap-3 pt-2">
                            {[
                                { Icon: Facebook, href: "#" },
                                { Icon: Youtube, href: "#" },
                                { Icon: Instagram, href: "#" },
                                { Icon: Twitter, href: "#" },
                            ].map(({ Icon, href }, i) => (
                                <Link key={i} href={href} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-zinc-700 text-zinc-400 hover:bg-white hover:text-zinc-950 hover:border-white transition-all duration-300">
                                    <Icon className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* 2. Trending News */}
                    <div>
                        <h3 className="font-black text-xs uppercase tracking-widest text-white mb-6 md:mb-8">Trending News</h3>
                        <ul className="space-y-2.5 md:space-y-3">
                            {["Business", "National", "Sports", "Entertainment", "Punjab", "Technology"].map((item) => (
                                <li key={item}>
                                    <Link href={`/category/${item.toLowerCase()}`} className="text-zinc-400 hover:text-white transition-colors text-sm font-bold block">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. Information */}
                    <div>
                        <h3 className="font-black text-xs uppercase tracking-widest text-white mb-6 md:mb-8">Information</h3>
                        <ul className="space-y-2.5 md:space-y-3">
                            {[
                                { label: "Home", path: "/" },
                                { label: "About Us", path: "/about" },
                                { label: "Contact Us", path: "/contact" },
                                { label: "Latest News", path: "/feed" },
                                { label: "Privacy Policy", path: "/privacy" },
                                { label: "Terms of Service", path: "/terms" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.path} className="text-zinc-400 hover:text-white transition-colors text-sm font-bold block">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 4. Stay Updated */}
                    <div className="sm:col-span-2 lg:col-span-1 space-y-5 md:space-y-6">
                        <div>
                            <h3 className="font-black text-xs uppercase tracking-widest text-white mb-2">Stay Updated</h3>
                            <p className="text-zinc-500 text-xs font-bold leading-relaxed">
                                Subscribe for the latest breaking news delivered straight to your inbox.
                            </p>
                        </div>
                        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative overflow-hidden bg-white/5 rounded-md border border-white/10 focus-within:border-red-600 transition-colors">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3.5 bg-transparent text-white text-sm font-bold outline-none placeholder:text-zinc-600"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3.5 bg-red-600 text-white font-black uppercase tracking-widest text-xs rounded-md shadow-lg shadow-red-600/20 hover:bg-white hover:text-red-600 transition-all flex items-center justify-center gap-2"
                            >
                                Subscribe <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-zinc-900 pt-8 text-center">
                    <p className="text-zinc-600 text-[11px] font-black uppercase tracking-widest">
                        © {new Date().getFullYear()} All rights reserved by{" "}
                        <a href="https://nextgrowthdigital.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-all underline underline-offset-4">
                            Next Growth Digital
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
