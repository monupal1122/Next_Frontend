import { getArticlesByCategory, getAds } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewsCard } from "@/components/news/NewsCard";
import { TrendingSidebar } from "@/components/news/TrendingSidebar";
import { AdsBanner } from "@/components/news/AdsBanner";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const displayName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
    return {
        title: `${displayName} News | Daily News Views`,
        description: `Latest Intelligence and Breaking Updates in ${displayName}.`,
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;

    const [articles, allAds] = await Promise.all([
        getArticlesByCategory(slug),
        getAds()
    ]);

    const displayName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-6 md:py-10 max-w-7xl">
                {/* Page Header */}
                <div className="mb-8 md:mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-zinc-500 hover:text-red-700 transition-colors mb-4 md:mb-6 font-black uppercase tracking-widest text-[10px]"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <div className="flex flex-wrap items-end justify-between gap-4 border-b-4 md:border-b-8 border-zinc-950 pb-4 md:pb-6 relative">
                        <div className="flex flex-col gap-1 md:gap-2">
                            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-950 leading-none">{displayName}</h1>
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-1 md:mt-2 opacity-60">
                                Latest updates in {displayName}
                            </p>
                        </div>
                        <div className="absolute bottom-[-4px] md:bottom-[-8px] left-0 w-24 md:w-64 h-1 md:h-2 bg-red-600" />
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Articles */}
                    <div className="lg:col-span-8">
                        {articles && articles.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8">
                                {articles.map((article: any) => (
                                    <NewsCard key={article._id} article={article} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-zinc-200 text-zinc-400">
                                <p className="font-black uppercase tracking-widest text-sm mb-2">No Articles Yet.</p>
                                <p className="text-xs font-bold uppercase tracking-tight opacity-50">This category doesn&apos;t have any stories yet.</p>
                            </div>
                        )}

                        {/* Mobile: Inject sidebar content after articles */}
                        <div className="lg:hidden mt-10 space-y-8">
                            <TrendingSidebar />
                            <AdsBanner position="sidebar" initialAds={allAds} />
                        </div>
                    </div>

                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block lg:col-span-4 h-fit">
                        <div className="sticky top-28 space-y-10">
                            <AdsBanner position="sidebar" initialAds={allAds} />
                            <TrendingSidebar />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
