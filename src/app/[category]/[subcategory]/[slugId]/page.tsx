import { Metadata, ResolvingMetadata } from "next";
import { getArticle, getArticlesByCategory, getAds, getHeadlines } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, ShieldCheck, Share2, Activity, Calendar } from "lucide-react";
import { TrendingSidebar } from "@/components/news/TrendingSidebar";
import { ShareButtons } from "@/components/news/ShareButtons";
import { NewsCard } from "@/components/news/NewsCard";
import { AdsBanner } from "@/components/news/AdsBanner";
import { toAbsoluteUrl, safeFormatDate } from "@/lib/utils";

type Props = {
    params: Promise<{
        category: string;
        subcategory: string;
        slugId: string;
    }>;
};

const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "https://admin.korsimnaturals.com";

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { category, subcategory, slugId } = await params;
    const article = await getArticle(category, subcategory, slugId);

    if (!article) return { title: "Article Not Found | Daily News Views" };

    const ogImage = toAbsoluteUrl(article.featuredImage || article.image);
    return {
        title: `${article.title} | DNV`,
        description: article.summary || article.description || "",
        metadataBase: new URL(SITE_DOMAIN),
        openGraph: {
            title: article.title,
            description: article.summary || article.description || "",
            url: `${SITE_DOMAIN}/${category}/${subcategory}/${slugId}`,
            siteName: "Daily News Views",
            images: [{ url: ogImage, width: 1200, height: 630 }],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            images: [ogImage],
        }
    };
}

export default async function ArticlePage({ params }: Props) {
    const { category, subcategory, slugId } = await params;

    // Fetch all data on the server
    const [article, allAds, trendingHeadlines] = await Promise.all([
        getArticle(category, subcategory, slugId),
        getAds(),
        getHeadlines(),
    ]);

    if (!article) notFound();

    const ogImage = toAbsoluteUrl(article.featuredImage || article.image);
    const pageUrl = `${SITE_DOMAIN}/${category}/${subcategory}/${slugId}`;
    const relatedArticles = await getArticlesByCategory(category);

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans">
            <main className="container mx-auto px-3 sm:px-4 lg:px-8 py-5 md:py-8 max-w-7xl">
                {/* Back Link */}
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-red-600 transition-all font-bold text-[11px] md:text-[13px]">
                        <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" /> Back to home
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="lg:col-span-8">
                        <article className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-sm border border-zinc-100">
                            {/* Meta row */}
                            <div className="flex items-center flex-wrap gap-4 mb-8">
                                <span className="bg-red-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm shadow-lg shadow-red-600/10">
                                    {typeof article.category === 'object' ? article.category.name : article.category}
                                </span>
                                <span className="flex items-center gap-1.5 text-zinc-400 text-[12px] font-bold">
                                    <Clock className="w-4 h-4 opacity-70" /> {safeFormatDate(article.publishedAt || article.createdAt, "MMM d")}
                                </span>
                                <span className="flex items-center gap-1.5 text-zinc-400 text-[12px] font-bold">
                                    <Eye className="w-4 h-4 opacity-70" /> {article.viewCount || "11.2k"} views
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black leading-[1.15] mb-5 md:mb-8 text-zinc-950 tracking-tight">
                                {article.title}
                            </h1>

                            {/* Summary */}
                            {article.summary && (
                                <p className="text-base md:text-lg lg:text-xl text-zinc-500 leading-relaxed font-medium mb-6 md:mb-10 border-l-4 border-red-600 pl-4 md:pl-6 italic">
                                    {article.summary}
                                </p>
                            )}

                            {/* Main Image */}
                            <div className="relative aspect-[16/9] w-full mb-5 md:mb-8 rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl">
                                <Image
                                    src={ogImage}
                                    alt={article.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 850px"
                                />
                            </div>

                            <p className="text-zinc-400 text-[12px] font-bold mb-10 opacity-70">
                                Published: {safeFormatDate(article.publishedAt || article.createdAt, "MMMM d, yyyy h:mm a")}
                            </p>

                            {/* Social Engagement */}
                            <div className="border-y border-zinc-100 py-4 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <ShareButtons title={article.title} url={pageUrl} />
                            </div>

                            {/* Content Body */}
                            <div
                                className="prose prose-sm md:prose-base lg:prose-lg max-w-none text-zinc-800 leading-relaxed font-medium article-content-body-final"
                                dangerouslySetInnerHTML={{ __html: article.content || "" }}
                            />

                            {/* Author signature */}
                            <div className="mt-10 md:mt-16 pt-6 md:pt-8 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50 p-4 md:p-6 rounded-xl">
                                <div>
                                    <p className="text-zinc-900 font-bold uppercase text-sm tracking-tight mb-1">
                                        PUBLISHED BY: <span className="text-red-600">{article.author?.name || "Robin"}</span>
                                    </p>
                                    <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block opacity-70">DNV Editorial Staff</span>
                                </div>
                                <div className="w-12 h-12 bg-white border border-zinc-100 rounded-full flex items-center justify-center font-black text-red-600 shadow-sm text-lg">
                                    {(article.author?.name || "R")[0]}
                                </div>
                            </div>
                        </article>

                        {/* RELATED ARTICLES Section */}
                        {/* MOBILE: Sidebar injected before related articles */}
                        <div className="lg:hidden mt-8 space-y-8">
                            <TrendingSidebar initialArticles={trendingHeadlines} />
                            <AdsBanner position="sidebar" initialAds={allAds} />
                        </div>

                        {relatedArticles && relatedArticles.length > 0 && (
                            <section className="mt-20">
                                <div className="flex items-center gap-3 mb-10 pb-3 border-b-2 border-zinc-100 relative">
                                    <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-950">
                                        Related News
                                    </h2>
                                    <div className="absolute bottom-[-2px] left-0 w-24 h-[3px] bg-red-600" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {relatedArticles.slice(1, 4).map((related: any) => (
                                        <NewsCard key={related._id} article={related} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="hidden lg:block lg:col-span-4 h-fit">
                        <div className="sticky top-28 space-y-10">
                            <TrendingSidebar initialArticles={trendingHeadlines} />
                            <AdsBanner position="sidebar" initialAds={allAds} />
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

const styles = `
.article-content-body-final img {
    border-radius: 1rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
`;
