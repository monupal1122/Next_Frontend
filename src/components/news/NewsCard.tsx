"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, ArrowRight, Calendar } from "lucide-react";
import {
    cn,
    toAbsoluteUrl,
    safeFormatDate,
    calculateReadingTime,
} from "@/lib/utils";

interface NewsCardProps {
    article: any;
    variant?: "default" | "featured" | "horizontal" | "compact";
}

export function NewsCard({ article, variant = "default" }: NewsCardProps) {
    if (!article)
        return (
            <div className="animate-pulse bg-zinc-100 rounded-2xl h-48 w-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-zinc-200 border-t-red-600 rounded-full animate-spin" />
            </div>
        );

    const readingTime = calculateReadingTime(article.content);
    const categorySlug =
        typeof article.category === "object"
            ? article.category.slug || "uncategorized"
            : article.category || "uncategorized";
    const subcategorySlug = article.subcategories?.[0]?.slug || "general";

    const slugId =
        article.slug && article.publicId
            ? `${article.slug}-${article.publicId}`
            : article.publicId || article._id;

    const articleLink = `/${categorySlug}/${subcategorySlug}/${slugId}`;
    const imageSrc = toAbsoluteUrl(article.featuredImage || article.image);
    const excerpt = article.summary || article.description || "";
    const totalview = article.viewCount || 0;
    const categoryName =
        typeof article.category === "object" ? article.category.name : "News";

    // ─────────────────────────────────────────
    // FEATURED – Used in HeroSection slider
    // Full card: image left + content right on desktop, stacked on mobile
    // ─────────────────────────────────────────
    if (variant === "featured") {
        return (
            <Link
                href={articleLink}
                className="flex flex-col md:flex-row h-full w-full bg-white overflow-hidden group "
            >
                {/* Image Section */}
                <div className="relative w-full md:w-[60%] aspect-[16/10] md:aspect-auto md:h-full flex-shrink-0">
                    <div className="absolute inset-0 m-2 md:m-3 rounded-xl md:rounded-2xl overflow-hidden">
                        <Image
                            src={imageSrc}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-[10s] group-hover:scale-110"
                            priority
                            sizes="(max-width: 800px) 100vw, 100vw"
                        />
                        {/* Mobile Badge Overlay */}
                        <div className="absolute top-4 left-4 md:hidden">
                            <span className="bg-red-600 text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded shadow-lg">
                                {categoryName}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-[70%] flex flex-col justify-center p-5 sm:p-6 md:p-8 lg:p-8">
                    <div className="hidden md:flex items-center gap-3 mb-4 md:mb-6">
                        <span className="bg-red-600 text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded shadow-sm">
                            {categoryName}
                        </span>
                        <div className="h-4 w-[1px] bg-zinc-200" />
                        <span className="text-zinc-400 text-[11px] font-black uppercase tracking-[0.2em]">
                            {safeFormatDate(
                                article.publishedAt || article.createdAt,
                                "MMM d, yyyy",
                            )}
                        </span>
                    </div>

                    <h2
                        className="
              font-serif font-bold text-zinc-900 leading-snug
              group-hover:text-red-700 transition-colors
              line-clamp-3
              text-xl sm:text-2xl lg:text-3xl xl:text-4xl
              mb-2 lg:mb-4
            "
                    >
                        {article.title}
                    </h2>

                    {/* Excerpt */}
                    <p
                        className="
              text-zinc-500 leading-relaxed
              line-clamp-2 lg:line-clamp-4
              text-sm sm:text-base lg:text-[15px]
              mb-3 lg:mb-5
            "
                    >
                        {excerpt}
                    </p>
                    <p className="hidden lg:block text-zinc-400 text-sm mb-5 font-medium">
                        {safeFormatDate(article.publishedAt || article.createdAt, "d MMM yyyy, h:mm a")}
                    </p>

                    {/* Meta row — mobile */}
                    <div className="flex lg:hidden items-center gap-3 text-xs text-zinc-400 font-medium mb-3">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-red-500" />
                            {safeFormatDate(article.publishedAt || article.createdAt, "MMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {totalview} views
                        </span>
                    </div>
                    <div className="mt-auto pt-6 flex">
                        <span className="bg-red-600 text-white px-6 py-3 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 group-hover:bg-zinc-950 transition-colors shadow-xl shadow-red-600/20 group-hover:shadow-zinc-950/20 rounded-sm">
                            Explore Full Report <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    // ─────────────────────────────────────────
    // HORIZONTAL – Used in sidebars & trending lists
    // Small thumb + text side by side
    // ─────────────────────────────────────────
    if (variant === "horizontal" || variant === "compact") {
        return (
            <Link
                href={articleLink}
                className="flex gap-3 p-3 sm:p-4 group transition-all duration-300 hover:bg-zinc-50"
            >
                <div className="relative w-20 h-16 sm:w-24 sm:h-20 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 shadow-sm">
                    <Image
                        src={imageSrc}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <div className="flex flex-col justify-center min-w-0 flex-1">
                    <span className="text-red-600 text-[9px] font-black uppercase tracking-widest mb-1 block">
                        {categoryName}
                    </span>
                    <h3 className="text-sm md:text-base font-black text-zinc-900 leading-tight mb-1.5 line-clamp-2 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                        {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-zinc-400 text-[9px] font-bold uppercase tracking-widest opacity-70">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />{" "}
                            {safeFormatDate(
                                article.publishedAt || article.createdAt,
                                "MMM d",
                            )}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {totalview}
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    // ─────────────────────────────────────────
    // DEFAULT – Used in category grid sections
    // Vertical card: image top, content below
    // ─────────────────────────────────────────
    return (
        <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
            <Link
                href={articleLink}
                className="relative aspect-video overflow-hidden block bg-zinc-100"
            >
                <Image
                    src={imageSrc}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </Link>

            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-600 text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-sm">
                        {categoryName}
                    </span>
                    <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest opacity-60">
                        {safeFormatDate(article.publishedAt || article.createdAt, "MMM d")}
                    </span>
                </div>

                <Link href={articleLink} className="block mb-2">
                    <h3 className="text-sm md:text-base font-black text-zinc-900 leading-tight group-hover:text-red-700 transition-colors line-clamp-2 uppercase tracking-tight">
                        {article.title}
                    </h3>
                </Link>

                <p className="text-zinc-500 text-[11px] md:text-[13px] line-clamp-2 mb-4 font-medium leading-normal opacity-80">
                    {excerpt}
                </p>

                <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        <span className="text-red-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />{" "}
                            {safeFormatDate(
                                article.publishedAt || article.createdAt,
                                "MMM d",
                            )}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3 md:w-3.5 md:h-3.5" /> {totalview}
                        </span>
                    </div>

                    <Link
                        href={articleLink}
                        className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-zinc-950 transition-colors"
                    >
                        Read more
                    </Link>
                </div>
            </div>
        </div>
    );
}
