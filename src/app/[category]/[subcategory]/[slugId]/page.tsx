import { Metadata, ResolvingMetadata } from "next";
import { getArticle, getArticlesByCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, ShieldCheck, Share2, Tag, Calendar, User, ExternalLink, Activity } from "lucide-react";
import { TrendingSidebar } from "@/components/news/TrendingSidebar";
import { ShareButtons } from "@/components/news/ShareButtons";
import { NewsCard } from "@/components/news/NewsCard";
import { cn, toAbsoluteUrl, safeFormatDate, calculateReadingTime } from "@/lib/utils";

type Props = {
    params: Promise<{
        category: string;
        subcategory: string;
        slugId: string;
    }>;
};

const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8081";

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
    const readingTime = calculateReadingTime(article.content);

    // Fetch related articles (by category)
    const relatedArticles = await getArticlesByCategory(category);

    return (
        <div className="min-h-screen bg-white">
            <main className="container mx-auto px-4 py-8 lg:py-16 max-w-7xl">
                {/* Back Link with premium hover */}
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 text-zinc-400 hover:text-red-700 transition-all font-black uppercase tracking-[0.2em] text-[10px] group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                        Cancel Intelligence Session & Return
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Column (Main Content) */}
                    <article className="lg:col-span-8">
                        <header className="mb-12">
                            {/* Premium Meta row */}
                            <div className="flex items-center flex-wrap gap-4 mb-8">
                                {article.category && (
                                    <div className="bg-red-600 text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm shadow-lg shadow-red-600/20">
                                        {typeof article.category === 'object' ? article.category.name : article.category}
                                    </div>
                                )}
                                <span className="flex items-center gap-2 text-zinc-400 text-[11px] font-black uppercase tracking-widest">
                                    <Clock className="w-4 h-4 text-red-600" />
                                    {safeFormatDate(article.publishedAt || article.createdAt)}
                                </span>
                                <div className="flex items-center gap-2 bg-zinc-100 text-zinc-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-zinc-200">
                                    <ShieldCheck className="w-4 h-4 text-red-600 animate-pulse" /> Premium Intelligence
                                </div>
                                <div className="flex items-center gap-2 text-zinc-400 text-[11px] font-black uppercase tracking-widest border-l border-zinc-200 pl-4 ml-2">
                                    <Activity className="w-4 h-4" /> {readingTime}m Read
                                </div>
                            </div>

                            {/* Title (High Impact Typography) */}
                            <h1 className="text-4xl md:text-5xl lg:text-[60px] font-black leading-[1.05] mb-8 text-zinc-950 tracking-tighter uppercase italic">
                                {article.title}
                            </h1>

                            {/* Impactful Summary */}
                            {article.summary && (
                                <p className="text-xl md:text-2xl text-zinc-600 leading-relaxed font-medium mb-10 border-l-4 border-red-600 pl-8 italic">
                                    {article.summary}
                                </p>
                            )}

                            {/* Author Info (Upper) */}
                            <div className="flex items-center gap-4 py-6 border-y border-zinc-100 mb-10">
                                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white font-black text-xs border-4 border-zinc-100">
                                    {author?.name?.[0] || 'D'}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Published By Intel Command:</p>
                                    <p className="text-sm font-black uppercase text-zinc-900 tracking-tight">{author?.name || "DNV Intelligence Bureau"}</p>
                                </div>
                                <div className="ml-auto flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Intelligence Ref:</p>
                                        <p className="text-xs font-black uppercase text-zinc-900 tracking-tight">#{article.publicId || article._id}</p>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Featured High-Res image */}
                        <div className="relative aspect-[16/9] rounded-none overflow-hidden mb-6 bg-zinc-100 shadow-2xl group border-[12px] border-zinc-50">
                            <Image
                                src={ogImage}
                                alt={article.title}
                                fill
                                priority
                                className="object-cover transition-transform duration-[20s] group-hover:scale-110"
                                sizes="(max-width: 1024px) 100vw, 900px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Image Caption with Source */}
                        {article.imageCaption && (
                            <p className="text-xs text-zinc-400 font-black uppercase tracking-[0.2em] mb-16 text-center italic">
                                Top Secret Image Capture // {article.imageCaption}
                            </p>
                        )}

                        {/* Social Engagement Bar */}
                        <div className="sticky top-28 z-40 bg-white/95 backdrop-blur-md border-y-2 border-zinc-950 py-4 mb-20 flex items-center justify-between shadow-xl px-2">
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-2 text-zinc-900">
                                    <Eye className="w-5 h-5 text-red-600" />
                                    <span className="text-sm font-black uppercase tracking-widest">{article.viewCount || "1.2k"} Views</span>
                                </div>
                                <div className="h-4 w-[1px] bg-zinc-200 hidden sm:block" />
                                <div className="hidden sm:flex items-center gap-2 text-zinc-900">
                                    <Activity className="w-5 h-5 text-red-600" />
                                    <span className="text-sm font-black uppercase tracking-widest">Vetting Status: CLEARED</span>
                                </div>
                            </div>
                            <ShareButtons title={article.title} url={pageUrl} />
                        </div>

                        {/* Core Article Content Body (Refined Typography) */}
                        <div
                            className="prose prose-xl prose-zinc max-w-none mb-24 text-zinc-900 leading-[1.8] font-normal article-content-body first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-red-600"
                            dangerouslySetInnerHTML={{ __html: article.content || "" }}
                        />

                        {/* Tags & Taxonomy */}
                        <div className="pt-16 border-t-4 border-zinc-950 mt-20 space-y-12">
                            {article.tags && article.tags.length > 0 && (
                                <div className="space-y-6">
                                    <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-red-600">Cross-Referenced Tags:</h5>
                                    <div className="flex flex-wrap gap-3">
                                        {article.tags.map((tag: string) => (
                                            <Link
                                                key={tag}
                                                href={`/tags/${tag}`}
                                                className="px-6 py-2.5 bg-zinc-950 text-white hover:bg-red-700 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1"
                                            >
                                                #{tag}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Enhanced Author Bio and Social Call */}
                            <div className="p-10 bg-zinc-50 border-y-8 border-zinc-950 flex flex-col items-center text-center gap-6 group">
                                <div className="w-20 h-20 bg-zinc-950 rounded-none transform rotate-45 flex items-center justify-center text-white font-black text-2xl group-hover:rotate-0 transition-transform duration-500 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <span className="relative z-10">{author?.name?.[0] || 'D'}</span>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-red-600">Head of Intelligence bureau</span>
                                    <h4 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-900">{author?.name || "DNV Command Group"}</h4>
                                    <p className="text-zinc-500 text-sm max-w-md mx-auto font-medium leading-relaxed">
                                        Deciphering global events and reporting on the high-frequency movements within the intelligence sectors of the world.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    {['twitter', 'linkedin', 'globe'].map(icon => (
                                        <div key={icon} className="w-10 h-10 border-2 border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-red-700 hover:border-red-700 transition-all cursor-pointer">
                                            <Share2 className="w-4 h-4" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Right Column (High Impact Sidebar) */}
                    <aside className="lg:col-span-4 space-y-12">
                        {/* Trending Sidebar Component */}
                        <TrendingSidebar />

                        {/* Sticky Ad / Offer (Matches Modern News standard) */}
                        <div className="sticky top-32 space-y-10">
                            <div className="relative aspect-[3/4] w-full bg-zinc-900 overflow-hidden shadow-2xl group rounded-2xl border-b-8 border-red-600">
                                <Image
                                    src="https://images.unsplash.com/photo-1634128221889-82ed6efdfac3?q=80&w=1000&auto=format&fit=crop"
                                    alt="Global Summit"
                                    fill
                                    className="object-cover opacity-50 group-hover:scale-110 group-hover:opacity-70 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                                    <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 w-fit mb-4 rounded-sm animate-pulse">Official Intel Partner</span>
                                    <h4 className="text-4xl font-black uppercase italic tracking-tighter leading-none group-hover:text-red-500 transition-colors">Global Frontier Intelligence Summit</h4>
                                    <p className="text-white/60 text-[10px] font-bold mt-4 uppercase tracking-[0.3em]">Abu Dhabi // Dec 2026</p>
                                    <button className="mt-8 py-4 bg-white text-zinc-950 font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all transform hover:scale-105">Request Access Token</button>
                                </div>
                            </div>

                            {/* Newsletter signup placeholder style */}
                            <div className="bg-zinc-100 p-8 rounded-2xl border border-zinc-200">
                                <h4 className="text-xl font-black uppercase tracking-tighter mb-4 italic">Breaching the inbox daily.</h4>
                                <p className="text-sm text-zinc-500 font-medium mb-6">Join 85,000+ analysts receiving our 5:00 AM intelligence SITREP.</p>
                                <div className="space-y-3">
                                    <div className="h-12 bg-white border border-zinc-200 px-4 flex items-center text-zinc-300 text-xs font-bold">analyst@intelligence.gov</div>
                                    <button className="w-full bg-zinc-900 py-3 text-white font-black uppercase tracking-widest text-[10px]">Initialize Subscription</button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Related Intel Grid (Bottom Impact) */}
                {relatedArticles && relatedArticles.length > 0 && (
                    <section className="mt-32 pt-20 border-t-8 border-zinc-950">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-zinc-950 italic">Sector Related Intelligence</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mt-2">Correlated Data points in {category}</p>
                            </div>
                            <Link href={`/category/${category}`} className="bg-zinc-900 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors hidden sm:block">Explore Entire Sector</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

// Add CSS for first-letter drop cap effect
const styles = `
.article-content-body p:first-of-type::first-letter {
    font-size: 5rem;
    font-weight: 900;
    line-height: 1;
    margin-right: 0.75rem;
    float: left;
    color: #e11d48;
    text-transform: uppercase;
}
`;
