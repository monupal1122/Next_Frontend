import { Metadata, ResolvingMetadata } from "next";
import { getArticle, getArticlesByCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, ExternalLink, Calendar, ShieldCheck } from "lucide-react";
import { CategoryBadge } from "@/components/news/CategoryBadge";
import { Button } from "@/components/ui/button";
import { format, isValid, parseISO } from "date-fns";
import { TrendingSidebar } from "@/components/news/TrendingSidebar";
import { ShareButtons } from "@/components/news/ShareButtons";
import { NewsCard } from "@/components/news/NewsCard";

type Props = {
    params: Promise<{
        category: string;
        subcategory: string;
        slugId: string;
    }>;
};

const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8081";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function toAbsoluteUrl(url: string | undefined): string {
    if (!url) return `${SITE_DOMAIN}/logo1.webp`;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;

    const cleanPath = url.replace(/^public[\\/]/, "").replace(/\\/g, "/");
    const finalPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

    return `${IMAGE_BASE_URL}${finalPath}`;
}

// Helper to safely format dates
function safeFormatDate(dateStr: any, formatStr: string = "MMM d, yyyy h:mm a") {
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

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { category, subcategory, slugId } = await params;
    const article = await getArticle(category, subcategory, slugId);

    if (!article) {
        return { title: "Article Not Found | Daily News Views" };
    }

    const ogImage = toAbsoluteUrl(article.featuredImage || article.image);
    const title = article.title;
    const description = article.summary || article.description || "";
    const pageUrl = `${SITE_DOMAIN}/${category}/${subcategory}/${slugId}`;

    return {
        title: title,
        description: description,
        metadataBase: new URL(SITE_DOMAIN),
        openGraph: {
            title: title,
            description: description,
            url: pageUrl,
            siteName: "Daily News Views",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                    secureUrl: ogImage.startsWith('https') ? ogImage : undefined,
                },
            ],
            type: "article",
            publishedTime: article.publishedAt || article.createdAt,
            modifiedTime: article.updatedAt || article.publishedAt || article.createdAt,
            authors: [article.author?.name || "DNV Intelligence"],
            section: category,
            tags: article.tags || [],
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: [ogImage],
            site: "@DailyNewsViews",
            creator: "@DailyNewsViews",
        },
        alternates: { canonical: pageUrl },
    };
}

export default async function ArticlePage({ params }: Props) {
    const { category, subcategory, slugId } = await params;
    const article = await getArticle(category, subcategory, slugId);

    if (!article) {
        notFound();
    }

    const ogImage = toAbsoluteUrl(article.featuredImage || article.image);
    const author = article.author;
    const pageUrl = `${SITE_DOMAIN}/${category}/${subcategory}/${slugId}`;

    // Fetch related articles (by category)
    const relatedArticles = await getArticlesByCategory(category);

    return (
        <div className="min-h-screen bg-white">
            <main className="container mx-auto px-4 py-6 lg:py-10 max-w-7xl">
                {/* Back Link */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors font-bold text-xs"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Home
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column (Main Content) */}
                    <div className="lg:col-span-8">
                        <header className="mb-8">
                            {/* Meta row */}
                            <div className="flex items-center flex-wrap gap-3 mb-6">
                                {article.category && (
                                    <div className="bg-red-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm">
                                        {typeof article.category === 'object' ? article.category.name : article.category}
                                    </div>
                                )}
                                <span className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-bold">
                                    <Clock className="w-3.5 h-3.5" />
                                    {safeFormatDate(article.publishedAt || article.createdAt, "MMM d")}
                                </span>
                                <div className="flex items-center gap-1 bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    <ShieldCheck className="w-3 h-3 text-red-500" /> Premium
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl lg:text-[44px] font-black leading-tight mb-6 text-zinc-950 tracking-tight">
                                {article.title}
                            </h1>

                            {/* Summary */}
                            {article.summary && (
                                <p className="text-lg md:text-xl text-zinc-600 leading-relaxed font-medium mb-8">
                                    {article.summary}
                                </p>
                            )}
                        </header>

                        {/* Featured image */}
                        <div className="relative aspect-video rounded-none overflow-hidden mb-4 bg-zinc-100 shadow-sm">
                            <Image
                                src={ogImage}
                                alt={article.title}
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 800px"
                            />
                        </div>

                        {/* Image Caption */}
                        {article.imageCaption && (
                            <p className="text-sm text-zinc-500 font-medium mb-12 italic border-b border-zinc-50 pb-4">
                                {article.imageCaption}
                            </p>
                        )}

                        {/* Author & Published Info */}
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                                Published: {safeFormatDate(article.publishedAt || article.createdAt, "MMMM d, yyyy h:mm a")}
                            </div>
                        </div>

                        {/* Share Bar (Matches Screenshot) */}
                        <div className="border-y border-zinc-100 py-3 mb-10">
                            <ShareButtons title={article.title} url={pageUrl} />
                        </div>

                        {/* Article Body Content */}
                        <div
                            className="prose prose-lg prose-zinc max-w-none mb-16 text-zinc-900 leading-[1.65] font-normal"
                            dangerouslySetInnerHTML={{ __html: article.content || "" }}
                        />

                        {/* Source & Tags */}
                        <div className="border-t border-zinc-100 pt-10 mt-10 space-y-8">
                            {article.tags && article.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {article.tags.map((tag: string) => (
                                        <Link
                                            key={tag}
                                            href={`/tags/${tag}`}
                                            className="px-4 py-1.5 bg-zinc-50 hover:bg-zinc-100 rounded-full text-xs font-bold text-zinc-500 transition-all border border-zinc-200"
                                        >
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {author && (
                                <div className="p-6 bg-zinc-50/50 rounded-xl border border-zinc-100 flex items-center gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Published By:</span>
                                    <span className="font-black text-sm uppercase text-zinc-900">{author.name}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <aside className="lg:col-span-4 space-y-10">
                        {/* Trending Sidebar with Screenshot Styles */}
                        <div className="bg-white border border-zinc-200 rounded-none overflow-hidden">
                            <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                                    <h3 className="text-white font-black uppercase tracking-widest text-xs">Trending Now</h3>
                                </div>
                                <div className="bg-zinc-800 px-2 py-0.5 rounded text-[10px] text-white font-black">LIVE</div>
                            </div>
                            <TrendingSidebar />
                        </div>

                        {/* Advertisement (Matches Screenshot) */}
                        <div className="relative aspect-[3/4] w-full bg-zinc-100 overflow-hidden shadow-sm group">
                            <Image
                                src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop"
                                alt="Advertisement"
                                fill
                                className="object-cover transition-transform group-hover:scale-105 duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                                <span className="bg-primary text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 w-fit mb-3">Mega Sale</span>
                                <h4 className="text-white font-black uppercase tracking-tighter text-2xl leading-none">Global Tech Summit 2026</h4>
                                <p className="text-white/60 text-[10px] font-bold mt-2 uppercase tracking-widest">Reserve Your Seat Today</p>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Related Articles (Matches Screenshot Bottom) */}
                {relatedArticles && relatedArticles.length > 0 && (
                    <section className="mt-20 pt-10 border-t-2 border-zinc-900">
                        <div className="mb-10">
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-950">Related Articles</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedArticles.slice(0, 4).map((related: any) => (
                                <NewsCard key={related._id} article={related} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
