import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NewsCard } from "./NewsCard";

interface CategorySectionProps {
    articles: any[];
    title: string;
    categorySlug: string;
}

export function CategorySection({ articles, title, categorySlug }: CategorySectionProps) {
    return (
        <section className="w-full">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6 md:mb-10 pb-3 md:pb-4 border-b-2 border-zinc-100 relative">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tight md:tracking-widest text-zinc-950 flex items-center gap-2 md:gap-3">
                        <span className="w-1.5 md:w-2 h-6 md:h-8 bg-red-600 rounded-full" />
                        {title}
                    </h2>
                    <div className="h-[3px] md:h-[4px] bg-red-600 w-16 md:w-24 rounded-full mt-1" />
                </div>

                <Link
                    href={`/category/${categorySlug}`}
                    className="bg-red-600 text-white px-3 md:px-4 py-1.5 md:py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-all rounded-sm flex items-center gap-1.5 md:gap-2 shadow-lg shadow-red-600/20 whitespace-nowrap"
                >
                    View All <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
                </Link>
            </div>

            {/* Articles Grid: 1 col mobile → 2 col tablet → 3 col desktop */}
            {articles && articles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                    {articles.slice(0, 3).map((article) => (
                        <NewsCard key={article._id} article={article} />
                    ))}
                </div>
            ) : (
                <div className="py-16 md:py-20 text-center bg-white border border-zinc-100 rounded-xl">
                    <p className="text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] opacity-40">
                        No Stories Published in {title} yet.
                    </p>
                </div>
            )}
        </section>
    );
}
