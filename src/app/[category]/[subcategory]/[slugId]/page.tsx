import { Metadata, ResolvingMetadata } from "next";
import { getArticle, getArticlesByCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, ShieldCheck, Share2, Activity, Calendar } from "lucide-react";
import { TrendingSidebar } from "@/components/news/TrendingSidebar";
import { ShareButtons } from "@/components/news/ShareButtons";
import { NewsCard } from "@/components/news/NewsCard";
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
    const article = await getArticle(category, subcategory, slugId);

    if (!article) notFound();

    const ogImage = toAbsoluteUrl(article.featuredImage || article.image);
    const pageUrl = `${SITE_DOMAIN}/${category}/${subcategory}/${slugId}`;
    const relatedArticles = await getArticlesByCategory(category);

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans">
            <main className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
                {/* Back Link */}
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-red-600 transition-all font-bold text-[13px]">
                        <ArrowLeft className="w-4 h-4" /> Back to home
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="lg:col-span-8">
                        <article className="bg-white rounded-2xl p-6 md:p-8 lg:p-10 shadow-sm border border-zinc-100">
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
                            <h1 className="text-3xl md:text-4xl lg:text-[45px] font-black leading-[1.15] mb-8 text-zinc-950 tracking-tight">
                                {article.title}
                            </h1>

                            {/* Summary */}
                            {article.summary && (
                                <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium mb-10 border-l-4 border-red-600 pl-6 italic">
                                    {article.summary}
                                </p>
                            )}

                            {/* Main Image */}
                            <div className="relative aspect-[16/9] w-full mb-8 rounded-2xl overflow-hidden shadow-2xl">
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
                                className="prose prose-lg max-w-none text-zinc-800 leading-relaxed font-medium article-content-body-final"
                                dangerouslySetInnerHTML={{ __html: article.content || "" }}
                            />

                            {/* Author signature */}
                            <div className="mt-16 pt-8 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50 p-6 rounded-xl">
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
                        {relatedArticles && relatedArticles.length > 0 && (
                            <section className="mt-20">
                                <div className="flex items-center gap-3 mb-10">
                                    <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-950 italic underline decoration-red-600 decoration-4 underline-offset-8">
                                        Related Articles
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {relatedArticles.slice(0, 4).map((related: any) => (
                                        <NewsCard key={related._id} article={related} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="lg:col-span-4 space-y-12">
                        <TrendingSidebar />

                        {/* Mega Sale Sidebar Ad */}
                        <div className="rounded-2xl overflow-hidden shadow-2xl relative group cursor-pointer border border-zinc-100 aspect-[4/5]">
                            <img
                                src="https://images.unsplash.com/photo-1620330202142-2989b70b3b42?q=80&w=1000&auto=format&fit=crop"
                                alt="Mega Sale Advertisement"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[10s]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-red-600/90 via-red-600/20 to-transparent flex flex-col justify-end p-8 text-white">
                                <span className="bg-white text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-4 shadow-lg">Special Offer</span>
                                <h4 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-3">Mega Sale</h4>
                                <p className="text-zinc-100 text-[11px] font-bold uppercase tracking-widest opacity-90">Up to 70% Off Latest Gadgets. Vibe your lifestyle with DNV Exclusive.</p>
                                <button className="mt-6 w-full py-4 bg-white text-red-600 font-black uppercase tracking-widest text-[11px] hover:bg-zinc-900 hover:text-white transition-all shadow-xl">Shop Collection</button>
                            </div>
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
