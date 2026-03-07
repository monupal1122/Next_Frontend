import { Metadata } from "next";
import { getArticlesByCategory, getCategories } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewsCard } from "@/components/news/NewsCard";
import { TrendingSidebar } from "@/components/news/TrendingSidebar";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const displayName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
    return {
        title: `${displayName} News | Daily News Views`,
        description: `Latest Intelligence and Breaking Updates in ${displayName}.`,
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    const articles = await getArticlesByCategory(slug);

    // Capitalize category name for display
    const displayName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-zinc-500 hover:text-red-700 transition-colors mb-6 font-black uppercase tracking-widest text-[10px]"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Intelligence Feed
                    </Link>

                    <div className="flex items-center justify-between border-b-8 border-zinc-950 pb-6 relative">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-950 leading-none">{displayName}</h1>
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2 opacity-60">
                                Segmented Intelligence Monitoring: {displayName}
                            </p>
                        </div>
                        <div className="absolute bottom-[-8px] left-0 w-32 md:w-64 h-2 bg-red-600" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Articles Grid */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {articles?.map((article: any) => (
                                <NewsCard key={article._id} article={article} />
                            ))}
                        </div>
                        {articles?.length === 0 && (
                            <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-zinc-200 text-zinc-400">
                                <p className="font-black uppercase tracking-widest text-sm mb-2">No Intelligence Data Recorded.</p>
                                <p className="text-xs font-bold uppercase tracking-tight opacity-50">Transmissions for this sector are currently empty.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-12 h-fit">
                        {/* Sidebar Ad Prototype */}
                        <div className="bg-zinc-950 p-8 rounded-none border-b-4 border-red-600 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rotate-45 translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 mb-4">Strategic Placement</h4>
                            <p className="text-xl font-black uppercase tracking-tighter leading-tight relative z-10 text-white">Access Premium Global Intelligence Briefings</p>
                        </div>
                        <TrendingSidebar />
                    </aside>
                </div>
            </div>
        </div>
    );
}
