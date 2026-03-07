"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, ChevronDown, Rocket, ArrowRight } from "lucide-react";
import { getCategories, getHeadlines } from "@/lib/api";

interface NavbarProps {
    initialCategories?: any[];
    initialHeadlines?: any[];
}

export function Navbar({ initialCategories = [], initialHeadlines = [] }: NavbarProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isTickerPaused, setIsTickerPaused] = useState(false);
    const [categories, setCategories] = useState<any[]>(initialCategories);
    const [headlines, setHeadlines] = useState<any[]>(initialHeadlines);
    const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

    useEffect(() => {
        // Only fetch if initial data is empty (fallback)
        if (initialCategories.length === 0 || initialHeadlines.length === 0) {
            const fetchData = async () => {
                const [catData, headData] = await Promise.all([
                    getCategories(),
                    getHeadlines(),
                ]);
                if (catData?.length) setCategories(catData);
                if (headData?.length) setHeadlines(headData);
            };
            fetchData();
        }
    }, [initialCategories, initialHeadlines]);

    const getArticleLink = (article: any) => {
        const categorySlug = typeof article.category === "object" ? article.category.slug : "uncategorized";
        const subcategorySlug = article.subcategories?.[0]?.slug || "general";
        const slugId = `${article.slug}-${article.publicId}`;
        return `/${categorySlug}/${subcategorySlug}/${slugId}`;
    };

    return (
        <header className="z-50 bg-white sticky top-0 border-b-4 border-zinc-950 shadow-xl">
            {/* 1. Breaking News Ticker */}
            <div className="bg-primary text-white border-y border-primary/20 py-1.5 overflow-hidden">
                <div className="container mx-auto px-4 flex items-center gap-3 md:gap-8">
                    <div className="flex-shrink-0 flex items-center gap-1.5 px-2 md:px-4 py-1 bg-red-600 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] italic animate-pulse rounded">
                        <Rocket className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current" />
                        <span className="hidden sm:inline">Breaking</span> News
                    </div>

                    <div className="flex-1 relative overflow-hidden h-6">
                        <div
                            className="animate-infinite-scroll flex gap-8 md:gap-12 whitespace-nowrap py-1"
                            style={{ animationPlayState: isTickerPaused ? "paused" : "running" }}
                        >
                            {(headlines.length > 0 ? [...headlines, ...headlines] : []).map((article, idx) => (
                                <Link
                                    key={`${article._id}-${idx}`}
                                    href={getArticleLink(article)}
                                    className="flex items-center gap-2 md:gap-3 text-[11px] md:text-[13px] font-bold uppercase tracking-wider hover:text-red-500 transition-colors group"
                                    onMouseEnter={() => setIsTickerPaused(true)}
                                    onMouseLeave={() => setIsTickerPaused(false)}
                                >
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full group-hover:scale-150 transition-transform flex-shrink-0" />
                                    {article.title}
                                </Link>
                            ))}
                            {headlines.length === 0 && (
                                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                                    Loading the latest intelligence from around the globe...
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Nav Bar */}
            <div className="bg-white/95 backdrop-blur-md relative border-t border-zinc-100">
                <div className="container mx-auto px-4 lg:px-8 flex items-center h-20 lg:h-24">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 -ml-2 hover:bg-zinc-100 rounded-full transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <Link href="/" className="flex items-center">
                            <img
                                src="/logo1.webp"
                                alt="DN logo"
                                className="h-12 lg:h-18 w-auto max-w-[150px] lg:max-w-none object-contain"
                            />
                        </Link>
                    </div>

                    <div className="ml-auto flex items-center h-full">
                        <nav className="hidden lg:flex items-center h-full no-scrollbar">
                            <Link
                                href="/"
                                className="px-5 h-full flex items-center text-[17px] font-bold text-zinc-900 border-r border-zinc-100 hover:text-red-600 hover:bg-zinc-50 transition-all uppercase tracking-tighter"
                            >
                                Home
                            </Link>

                            {categories.slice(0, 7).map((cat) => (
                                <div key={cat._id} className="group relative h-full">
                                    <button className="px-5 h-full flex items-center gap-1 text-[17px] font-bold text-zinc-900 border-r border-zinc-100 hover:text-red-600 hover:bg-zinc-50 transition-all uppercase tracking-tighter outline-none cursor-pointer">
                                        {cat.name}
                                        <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                                    </button>
                                    <div className="absolute top-full left-0 bg-white border-t-4 border-zinc-950 p-6 w-64 shadow-2xl opacity-0 invisible translate-y-3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50">
                                        <Link
                                            href={`/category/${cat.slug}`}
                                            className="font-black text-red-600 mb-4 block p-2 hover:bg-zinc-50 border-b border-zinc-100 uppercase tracking-widest text-xs"
                                        >
                                            See All Intelligence Report
                                        </Link>
                                        <div className="space-y-1">
                                            {cat.subcategories?.map((sub: any) => (
                                                <Link
                                                    key={sub._id}
                                                    href={`/subcategory/${cat.slug}/${sub.slug}`}
                                                    className="p-3 font-bold text-zinc-600 hover:text-red-600 hover:bg-zinc-50 block transition-colors uppercase tracking-tight text-[14px]"
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </nav>

                        <div className="flex items-center pl-4 border-l border-zinc-100 h-full ml-2">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (searchQuery.trim()) {
                                        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                                    }
                                }}
                                className="hidden sm:flex items-center relative group min-w-[150px]"
                            >
                                <Search className="absolute left-3 w-4 h-4 text-zinc-400 group-focus-within:text-red-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Intelligence Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-3 py-2 bg-transparent text-[11px] font-bold uppercase tracking-widest border-b border-transparent focus:border-red-600 focus:outline-none w-full transition-all duration-300"
                                />
                            </form>
                            <button
                                className="p-2 hover:text-red-600 transition-colors sm:hidden"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                            >
                                <Search className="w-6 h-6" />
                            </button>
                            {isSearchOpen && (
                                <div className="absolute top-full left-0 w-full bg-white p-4 shadow-2xl border-t border-zinc-100 sm:hidden z-50">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (searchQuery.trim()) {
                                                window.location.href = `/search?q=${searchQuery}`;
                                            }
                                        }}
                                        className="relative"
                                    >
                                        <input
                                            type="text"
                                            autoFocus
                                            placeholder="Deep Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-4 pr-12 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-bold uppercase tracking-widest outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                                        />
                                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-red-600 text-white rounded-md shadow-lg shadow-red-600/20 active:scale-95 transition-all">
                                            <Search className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Custom implementation matching Sheet look) */}
            <div className={cn(
                "fixed inset-0 bg-black/60 z-[100] transition-opacity duration-300 lg:hidden",
                isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )} onClick={() => setIsMobileMenuOpen(false)}>
                <div
                    className={cn(
                        "fixed inset-y-0 left-0 w-[85%] bg-white   transition-transform duration-500 ease-in-out shadow-2xl overflow-y-auto no-scrollbar",
                        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-zinc-200 p-8 flex items-center justify-between">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                            <img src="/logo1.webp" alt="logo" className="h-14 w-auto object-contain" />
                        </Link>
                        <button onClick={() => setIsMobileMenuOpen(false)}>
                            <X className="w-8 h-8 text-zinc-900" />
                        </button>
                    </div>

                    <nav className="p-6 space-y-2">
                        <Link
                            href="/"
                            className="block text-xl font-black uppercase tracking-tighter text-zinc-800 p-4 border-b border-zinc-100 hover:text-red-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        {categories.map((cat) => (
                            <div key={cat._id} className="border-b border-zinc-100">
                                <div className="flex items-center justify-between">
                                    <Link
                                        href={`/category/${cat.slug}`}
                                        className="flex-1 text-xl font-black uppercase tracking-tighter text-zinc-800 p-4 hover:text-red-600"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {cat.name}
                                    </Link>
                                    {cat.subcategories?.length > 0 && (
                                        <button
                                            onClick={() => setOpenCategoryId(openCategoryId === cat._id ? null : cat._id)}
                                            className="p-4 text-zinc-400 hover:text-red-600"
                                        >
                                            <ChevronDown className={cn("w-6 h-6 transition-transform", openCategoryId === cat._id && "rotate-180 text-red-600")} />
                                        </button>
                                    )}
                                </div>
                                {openCategoryId === cat._id && (
                                    <div className="bg-zinc-50 border-l-4 border-red-600 ml-4 mb-4 animate-in slide-in-from-top-2">
                                        <Link
                                            href={`/category/${cat.slug}`}
                                            className="flex items-center gap-2 p-4 text-[12px] font-black uppercase tracking-widest text-red-600"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <ArrowRight className="w-4 h-4" /> Comprehensive Intelligence
                                        </Link>
                                        {cat.subcategories.map((sub: any) => (
                                            <Link
                                                key={sub._id}
                                                href={`/subcategory/${cat.slug}/${sub.slug}`}
                                                className="block p-4 pl-8 font-bold text-zinc-600 hover:text-red-600 border-t border-zinc-200 text-lg uppercase tracking-tight"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
