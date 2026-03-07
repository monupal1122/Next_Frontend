"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getSearchArticles } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Search as SearchIcon, Loader2 } from "lucide-react";
import { NewsCard } from "@/components/news/NewsCard";
import { TrendingSidebar } from "@/components/news/TrendingSidebar";

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [articles, setArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (query) {
            setIsLoading(true);
            getSearchArticles(query).then(data => {
                setArticles(data);
                setIsLoading(false);
            });
        } else {
            setArticles([]);
            setIsLoading(false);
        }
    }, [query]);

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
            {/* Header */}
            <div className="mb-12">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-red-700 transition-colors mb-6 font-black uppercase tracking-widest text-[10px]"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Cancel Search & Return Home
                </Link>

                <div className="flex items-center justify-between border-b-8 border-zinc-950 pb-6 relative">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-950 leading-none flex items-center gap-4">
                            SEARCH: {query || "..."}
                        </h1>
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2 opacity-60">
                            {isLoading ? "Scanning Global Databases..." : `Detected ${articles.length} matched intelligence points`}
                        </p>
                    </div>
                    <div className="absolute bottom-[-8px] left-0 w-32 md:w-64 h-2 bg-red-600" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Articles Grid */}
                <div className="lg:col-span-8">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
                            <Loader2 className="w-12 h-12 animate-spin mb-4 text-red-600" />
                            <p className="font-black uppercase tracking-widest text-sm">Deciphering Search Query...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {articles?.map((article: any) => (
                                <NewsCard key={article._id} article={article} />
                            ))}
                        </div>
                    )}

                    {!isLoading && articles?.length === 0 && query && (
                        <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-zinc-200 text-zinc-400">
                            <SearchIcon className="w-16 h-16 mx-auto mb-6 opacity-20" />
                            <p className="font-black uppercase tracking-widest text-sm mb-2">Query Yielded No Matches.</p>
                            <p className="text-xs font-bold uppercase tracking-tight opacity-50">Try broadening your search parameters.</p>
                        </div>
                    )}

                    {!query && !isLoading && (
                        <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-zinc-200 text-zinc-400">
                            <p className="font-black uppercase tracking-widest text-sm mb-2">Awaiting Intelligence Command.</p>
                            <p className="text-xs font-bold uppercase tracking-tight opacity-50">Enter a keyword to scan our archives.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-4 space-y-12 h-fit">
                    <TrendingSidebar />
                </aside>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <Suspense fallback={
                <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-zinc-400">
                    <Loader2 className="w-12 h-12 animate-spin mb-4 text-red-600" />
                    <p className="font-black uppercase tracking-widest text-sm">Initializing Secure Search Protocol...</p>
                </div>
            }>
                <SearchContent />
            </Suspense>
        </div>
    );
}
