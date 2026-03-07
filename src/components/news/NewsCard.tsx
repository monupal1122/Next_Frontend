"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, ArrowRight, Calendar } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { CategoryBadge } from "./CategoryBadge";
import { cn } from "@/lib/utils";

// Helper to safely format dates
function safeFormatDate(dateStr: any, formatStr: string = "MMM d, yyyy") {
    if (!dateStr) return "";
    try {
        const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
        if (isValid(date)) {
            return format(date, formatStr);
        }
        return "";
    } catch (e) {
        return "";
    }
}

export function calculateReadingTime(content: string | undefined) {
    const wordsPerMinute = 200;
    if (!content) return 1;
    const text = content.replace(/<[^>]*>/g, "");
    const wordCount = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

interface NewsCardProps {
    article: any;
    variant?: "default" | "featured" | "horizontal" | "compact";
}

function toAbsoluteUrl(url: string | undefined): string {
    const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8081";
    const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

    if (!url) return "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?q=80&w=1000&auto=format&fit=crop";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;

    const cleanPath = url.replace(/^public[\\/]/, "").replace(/\\/g, "/");
    const finalPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

    return `${IMAGE_BASE_URL}${finalPath}`;
}

export function NewsCard({ article, variant = "default" }: NewsCardProps) {
    if (!article) return <div className="animate-pulse bg-zinc-100 rounded-2xl h-32 w-full" />;

    const readingTime = calculateReadingTime(article.content);
    const categorySlug = typeof article.category === "object" ? (article.category.slug || "uncategorized") : (article.category || "uncategorized");
    const subcategorySlug = article.subcategories?.[0]?.slug || "general";
    const slugId = article.slug ? `${article.slug}-${article.publicId || article._id}` : (article.publicId || article._id);
    const articleLink = `/${categorySlug}/${subcategorySlug}/${slugId}`;
    const imageSrc = toAbsoluteUrl(article.featuredImage || article.image);
    const excerpt = article.summary || article.description || "";
    const totalview = article.viewCount || 0;
    const categoryName = typeof article.category === "object" ? article.category.name : (article.category || "General");

    const formattedDate = safeFormatDate(article.publishedAt || article.createdAt);

    // ─── Featured Variant ───────────────────────────────────────────────────────
    if (variant === "featured") {
        return (
            <Link
                href={articleLink}
                className="group block h-full bg-white hover:shadow-xl transition-all duration-300 border border-zinc-100 rounded-2xl overflow-hidden"
            >
                <div className="flex flex-col lg:flex-row h-full">
                    <div className="w-full aspect-[16/9] lg:w-[58%] lg:aspect-auto lg:min-h-[320px] relative overflow-hidden rounded-xl m-2 lg:rounded-xl lg:m-3 flex-shrink-0">
                        <Image
                            src={imageSrc}
                            alt={article.title || "News"}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 lg:hidden">
                            <CategoryBadge category={article.category} />
                        </div>
                    </div>

                    <div className="flex flex-col justify-center p-4 sm:p-5 lg:p-6 flex-1 min-w-0">
                        <div className="hidden lg:flex items-center gap-3 mb-3">
                            <CategoryBadge category={article.category} />
                            {formattedDate && (
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                    {formattedDate}
                                </span>
                            )}
                        </div>

                        <h2 className="font-serif font-bold text-zinc-900 leading-snug group-hover:text-red-700 transition-colors line-clamp-3 text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-2 lg:mb-4 uppercase tracking-tighter">
                            {article.title}
                        </h2>

                        <p className="text-zinc-500 leading-relaxed line-clamp-2 lg:line-clamp-4 text-sm sm:text-base lg:text-[15px] mb-3 lg:mb-5">
                            {excerpt}
                        </p>

                        <div className="mt-auto flex items-center gap-2 text-sm font-bold text-zinc-900 uppercase tracking-widest group-hover:gap-3 transition-all">
                            Read Full Story
                            <ArrowRight className="w-4 h-4 text-red-600 flex-shrink-0" />
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    // ─── Horizontal/Compact Variant ─────────────────────────────────────────────────────
    if (variant === "horizontal" || variant === "compact") {
        return (
            <Link
                href={articleLink}
                className="group flex gap-3 p-3 hover:bg-zinc-50 hover:shadow-sm transition-all duration-300 bg-white rounded-2xl border border-zinc-100 h-full"
            >
                <div className="flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 shadow-sm w-24 h-20 sm:w-32 sm:h-24 md:w-36 md:h-26 relative">
                    <Image
                        src={imageSrc}
                        alt={article.title || "News"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                <div className="flex flex-col justify-center min-w-0 flex-1 gap-1">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1 h-3 bg-red-600 rounded-full flex-shrink-0" />
                        <span className="text-[11px] sm:text-xs font-black uppercase text-zinc-400 tracking-widest truncate">
                            {categoryName}
                        </span>
                    </div>

                    <h4 className="font-black text-zinc-900 leading-snug group-hover:text-red-600 transition-colors tracking-tight line-clamp-2 text-sm sm:text-base md:text-[15px] uppercase">
                        {article.title}
                    </h4>

                    <div className="flex items-center gap-3 text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wide mt-0.5">
                        {formattedDate && (
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                                {safeFormatDate(article.publishedAt || article.createdAt, "MMM d")}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        );
    }

    // ─── Default Variant ────────────────────────────────────────────────────────
    return (
        <div className="group relative bg-white overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 border border-zinc-100 rounded-2xl">
            <Link
                href={articleLink}
                className="relative overflow-hidden block rounded-xl m-2 mb-0 aspect-video lg:aspect-[16/10]"
            >
                <Image
                    src={imageSrc}
                    alt={article.title || "News"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </Link>

            <div className="flex flex-col flex-1 p-3 pt-2 gap-2">
                <Link href={articleLink} className="block">
                    <h3 className="font-bold leading-snug text-zinc-800 group-hover:text-red-700 transition-colors line-clamp-2 text-base sm:text-lg uppercase tracking-tight">
                        {article.title}
                    </h3>
                </Link>

                {excerpt && (
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 font-medium">
                        {excerpt}
                    </p>
                )}

                <div className="mt-auto flex items-center flex-wrap gap-x-3 gap-y-1 text-zinc-400 font-medium pt-2 border-t border-zinc-100">
                    {formattedDate && (
                        <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                            <Calendar className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                            {formattedDate}
                        </span>
                    )}
                    <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                        <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                        {totalview} views
                    </span>
                    <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        {readingTime} min
                    </span>
                </div>
            </div>
        </div>
    );
}
