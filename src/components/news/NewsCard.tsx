"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, LucideIcon, Share2, Bookmark } from "lucide-react";
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

    // Improved slug handling
    const slugId = article.slug && article.publicId
        ? `${article.slug}-${article.publicId}`
        : (article.publicId || article._id);

    const articleLink = `/${categorySlug}/${subcategorySlug}/${slugId}`;
    const imageSrc = toAbsoluteUrl(article.featuredImage || article.image);
    const excerpt = article.summary || article.description || "";
    const totalview = article.viewCount || 0;

    if (variant === "featured") {
        return (
            <Link href={articleLink} className="group relative block h-full w-full overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-red-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm">
                            {typeof article.category === 'object' ? article.category.name : "Featured"}
                        </span>
                        <span className="text-white/60 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> {safeFormatDate(article.publishedAt || article.createdAt)}
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-5xl font-black text-white leading-[1.1] mb-4 group-hover:text-red-500 transition-colors uppercase tracking-tight">
                        {article.title}
                    </h2>
                    <p className="text-white/70 text-sm md:text-lg line-clamp-2 max-w-3xl font-medium leading-relaxed">
                        {excerpt}
                    </p>
                </div>
            </Link>
        );
    }

    if (variant === "horizontal" || variant === "compact") {
        return (
            <Link href={articleLink} className="flex gap-4 p-3 group transition-all duration-300 rounded-xl">
                <div className="relative w-24 h-20 sm:w-28 sm:h-24 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                    <Image
                        src={imageSrc}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <div className="flex flex-col justify-center min-w-0 flex-1">
                    <span className="text-red-600 text-[10px] font-black uppercase tracking-widest mb-1 block">
                        {typeof article.category === 'object' ? article.category.name : "Intelligence"}
                    </span>
                    <h3 className="text-sm sm:text-[15px] font-black text-zinc-900 leading-tight mb-2 line-clamp-2 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                        {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-zinc-400 text-[9px] font-black uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {safeFormatDate(article.publishedAt || article.createdAt, "MMM d")}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {totalview}</span>
                    </div>
                </div>
            </Link>
        );
    }

    // Default Vertical Card
    return (
        <div className="news-card group flex flex-col h-full bg-white border border-zinc-100 shadow-sm hover:shadow-xl hover:border-zinc-200 transition-all">
            <Link href={articleLink} className="relative aspect-video overflow-hidden block">
                <Image
                    src={imageSrc}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-zinc-900/90 text-white px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-sm border border-white/10">
                        {typeof article.category === 'object' ? article.category.name : "Report"}
                    </span>
                </div>
            </Link>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-red-600" /> {safeFormatDate(article.publishedAt || article.createdAt, "MMM d, yyyy")}</span>
                    <span className="w-1 h-1 bg-zinc-200 rounded-full" />
                    <span className="flex items-center gap-1.5"><ActivityIcon className="w-3.5 h-3.5" /> {readingTime}m Read</span>
                </div>

                <Link href={articleLink} className="block group/title">
                    <h3 className="text-xl font-black text-zinc-900 leading-[1.2] mb-3 group-hover:text-red-600 transition-colors uppercase tracking-tight line-clamp-3">
                        {article.title}
                    </h3>
                </Link>

                <p className="text-zinc-500 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">
                    {excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-zinc-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                            <Eye className="w-4 h-4 text-zinc-400 group-hover:text-red-500" />
                        </div>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{totalview} Intel Points</span>
                    </div>
                    <Link
                        href={articleLink}
                        className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                    >
                        <Share2 className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ActivityIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}
