import { Metadata } from "next";
import { getArticlesByTag } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Hash } from "lucide-react";
import { NewsCard } from "@/components/news/NewsCard";
import { TrendingSidebar } from "@/components/news/TrendingSidebar";

interface Props {
    params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { tag } = await params;
    return {
        title: `#${tag} News | Daily News Views`,
        description: `Explore all transmissions and reports tagged with #${tag}.`,
    };
}

export default async function TagPage({ params }: Props) {
    const { tag } = await params;
    const articles = await getArticlesByTag(tag);

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
                        Explore More Intelligence
                    </Link>

                    <div className="flex items-center justify-between border-b-8 border-zinc-950 pb-6 relative">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-950 leading-none flex items-center gap-4">
                                <Hash className="w-8 h-8 md:w-12 md:h-12 text-red-600" /> #{tag}
                            </h1>
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2 opacity-60">
                                Global Transmission Tag: #{tag}
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
                                <p className="font-black uppercase tracking-widest text-sm mb-2">No Reports Matched this Identifier.</p>
                                <p className="text-xs font-bold uppercase tracking-tight opacity-50">Filter reset: transmissions currently silent.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-12 h-fit">
                        <TrendingSidebar />
                    </aside>
                </div>
            </div>
        </div>
    );
}
