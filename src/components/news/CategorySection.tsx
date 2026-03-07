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
        <section className="animate-fade-in w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 sm:mb-10 pb-4 border-b-4 border-zinc-900 relative gap-3">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-zinc-900 leading-none truncate">
                        {title}
                    </h2>
                </div>

                <Link
                    href={`/category/${categorySlug}`}
                    className="flex-shrink-0 flex items-center gap-1.5 text-white bg-red-600 hover:bg-zinc-900 transition-all duration-200 font-black uppercase tracking-widest shadow-lg hover:shadow-xl rounded-lg text-[9px] px-3 py-2 sm:text-[10px] sm:px-4 sm:py-2.5 md:text-[10px] md:px-5 md:py-3 whitespace-nowrap active:scale-95"
                >
                    View All Intelligence <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>

                {/* Red accent underline */}
                <div className="absolute bottom-[-4px] left-0 w-24 sm:w-36 md:w-48 h-1 bg-red-600" />
            </div>

            {/* Articles Grid */}
            {articles && articles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                    {articles.slice(0, 3).map((article) => (
                        <div key={article._id} className="h-full">
                            <NewsCard article={article} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center border-2 border-dashed border-zinc-200 bg-zinc-50 rounded-lg">
                    <p className="text-zinc-400 font-black uppercase tracking-widest text-xs sm:text-sm px-4 opacity-50">
                        No Intelligence Published for this Sector yet.
                    </p>
                </div>
            )}
        </section>
    );
}
