import { Metadata } from "next";
import { getArticlesBySubcategory } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewsCard } from "@/components/news/NewsCard";
import { TrendingSidebar } from "@/components/news/TrendingSidebar";

interface Props {
    params: Promise<{ category: string; subcategory: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { subcategory } = await params;
    const displayName = subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace(/-/g, ' ');
    return {
        title: `${displayName} News | Daily News Views`,
        description: `Deep dive into ${displayName} updates and latest reports.`,
    };
}

export default async function SubcategoryPage({ params }: Props) {
    const { category, subcategory } = await params;
    const articles = await getArticlesBySubcategory(category, subcategory);

    // Capitalize names for display
    const catName = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
    const subName = subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace(/-/g, ' ');

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href={`/category/${category}`}
                        className="inline-flex items-center gap-2 text-zinc-500 hover:text-red-700 transition-colors mb-6 font-black uppercase tracking-widest text-[10px]"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to {catName}
                    </Link>

                    <div className="flex items-center justify-between border-b-8 border-zinc-950 pb-6 relative">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-950 leading-none">{subName}</h1>
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2 opacity-60">
                                Specialized Intelligence Sub-Sector: {subName} ({catName})
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
                                <p className="font-black uppercase tracking-widest text-sm mb-2">No Specialized Intelligence Found.</p>
                                <p className="text-xs font-bold uppercase tracking-tight opacity-50">This sub-sector is currently under observation.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-12 h-fit">
                        <TrendingSidebar />
                        {/* Custom Sub-sector sidebar block */}
                        <div className="bg-red-600 p-8 rounded-none border-b-4 border-zinc-950 shadow-2xl relative overflow-hidden group">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-4 italic animate-pulse">Critical Observation</h4>
                            <p className="text-xl font-black uppercase tracking-tighter leading-tight relative z-10 text-white">Help us sustain unfiltered reports for {subName}.</p>
                            <button className="mt-6 px-6 py-3 bg-white text-zinc-950 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all">Support Now</button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
