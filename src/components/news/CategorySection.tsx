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
            {/* Header (Matches Screenshot - Clean Title + Red Badge) */}
            <div className="flex items-center justify-between mb-8 pb-3 border-b-2 border-zinc-100 relative">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-zinc-950">
                    {title}
                </h2>

                <Link
                    href={`/category/${categorySlug}`}
                    className="bg-red-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-colors flex items-center gap-2"
                >
                    View All <ArrowRight className="w-3 h-3" />
                </Link>

                {/* Red Underline Accent */}
                <div className="absolute bottom-[-2px] left-0 w-32 h-[3px] bg-red-600" />
            </div>

            {/* Articles Grid (Matches Screenshot - 3 Columns) */}
            {articles && articles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.slice(0, 3).map((article) => (
                        <NewsCard key={article._id} article={article} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center bg-white border border-zinc-100 rounded-xl">
                    <p className="text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] opacity-40">
                        No Stories Published in {title} yet.
                    </p>
                </div>
            )}
        </section>
    );
}
