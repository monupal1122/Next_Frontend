"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Share2, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { cn, toAbsoluteUrl, safeFormatDate, calculateReadingTime } from "@/lib/utils";

interface NewsCardProps {
    article: any;
    variant?: "default" | "featured" | "horizontal" | "compact";
}

export function NewsCard({ article, variant = "default" }: NewsCardProps) {
    if (!article) return (
        <div className="animate-pulse bg-zinc-100 rounded-2xl h-48 w-full flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-zinc-200 border-t-red-600 rounded-full animate-spin" />
        </div>
    );

    const readingTime = calculateReadingTime(article.content);
    const categorySlug = typeof article.category === "object" ? (article.category.slug || "uncategorized") : (article.category || "uncategorized");
    const subcategorySlug = article.subcategories?.[0]?.slug || "general";

    const slugId = article.slug && article.publicId
        ? `${article.slug}-${article.publicId}`
        : (article.publicId || article._id);

    const articleLink = `/${categorySlug}/${subcategorySlug}/${slugId}`;
    const imageSrc = toAbsoluteUrl(article.featuredImage || article.image);
    const excerpt = article.summary || article.description || "";
    const totalview = article.viewCount || 0;

    // Screenshot Style Featured Card
    if (variant === "featured") {
        return (
            <Link href={articleLink} className="flex flex-col md:flex-row h-full w-full bg-white overflow-hidden group">
                {/* Image Section (Matches Left Column of Screenshot) */}
                <div className="relative w-full md:w-[58%] h-48 sm:h-64 md:h-full p-2 md:p-3">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        <Image
                            src={imageSrc}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-[10s] group-hover:scale-110"
                            priority
                            sizes="(max-width: 1024px) 100vw, 800px"
                        />
                    </div>
                </div>

                {/* Content Section (Matches Right Column of Screenshot) */}
                <div className="w-full md:w-[42%] flex flex-col justify-center p-6 md:p-10 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-red-600 text-white px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm shadow-sm">
                            {typeof article.category === 'object' ? article.category.name : "National"}
                        </span>
                        <span className="text-zinc-400 text-[11px] font-black uppercase tracking-widest">
                            {safeFormatDate(article.publishedAt || article.createdAt, "MMM d")}
                        </span>
                    </div>

                    <h2 className="text-2xl md:text-[38px] font-black text-zinc-950 leading-[1.15] mb-6 tracking-tight group-hover:text-red-600 transition-colors">
                        {article.title}
                    </h2>

                    <p className="text-zinc-500 text-sm md:text-[15px] line-clamp-4 mb-8 font-medium leading-relaxed">
                        {excerpt}
                    </p>

                    <p className="text-zinc-400 text-[12px] font-bold mb-8 opacity-70">
                        {safeFormatDate(article.publishedAt || article.createdAt, "d MMM yyyy, h:mm a")}
                    </p>

                    <div className="mt-auto flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-zinc-950 group-hover:gap-4 transition-all">
                        READ FULL STORY <ArrowRight className="w-4 h-4 text-red-600" />
                    </div>
                </div>
            </Link>
        );
    }

    if (variant === "horizontal" || variant === "compact") {
        return (
            <Link href={articleLink} className="flex gap-4 p-4 group transition-all duration-300">
                <div className="relative w-24 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 shadow-sm transition-transform group-hover:scale-95">
                    <Image
                        src={imageSrc}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <div className="flex flex-col justify-center min-w-0 flex-1">
                    <span className="text-red-600 text-[9px] font-black uppercase tracking-widest mb-1.5 block">
                        {typeof article.category === 'object' ? article.category.name : "Intelligence"}
                    </span>
                    <h3 className="text-sm font-black text-zinc-900 leading-tight mb-2 line-clamp-2 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                        {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-zinc-400 text-[9px] font-bold uppercase tracking-widest opacity-70">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {safeFormatDate(article.publishedAt || article.createdAt, "MMM d")}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {totalview}</span>
                    </div>
                </div>
            </Link>
        );
    }

    // Default Variant (Grid/Category sections)
    return (
        <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
            <Link href={articleLink} className="relative aspect-video overflow-hidden block bg-zinc-100">
                <Image
                    src={imageSrc}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </Link>

            <div className="p-5 flex flex-col flex-1">
                <Link href={articleLink} className="block group/title">
                    <h3 className="text-lg md:text-xl font-black text-zinc-950 leading-[1.3] mb-3 group-hover:text-red-700 transition-colors line-clamp-2 uppercase tracking-tight">
                        {article.title}
                    </h3>
                </Link>

                <p className="text-zinc-500 text-[13px] line-clamp-3 mb-6 font-medium leading-relaxed opacity-80">
                    {excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-zinc-50 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        <span className="text-red-600 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {safeFormatDate(article.publishedAt || article.createdAt, "MMM d")}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> {totalview}
                        </span>
                    </div>

                    <Link
                        href={articleLink}
                        className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-zinc-950 transition-colors group-hover:underline underline-offset-4"
                    >
                        read more
                    </Link>
                </div>
            </div>
        </div>
    );
}
