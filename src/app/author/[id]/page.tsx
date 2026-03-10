import { Metadata, ResolvingMetadata } from "next";
import { getAuthorInfo, getAuthorArticles, getHeadlines, getAds } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { NewsCard } from "@/components/news/NewsCard";
import { TrendingSidebar } from "@/components/news/TrendingSidebar";
import { AdsBanner } from "@/components/news/AdsBanner";

type Props = {
    params: Promise<{ id: string }>;
};

const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "https://admin.korsimnaturals.com";

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { id } = await params;
    const author = await getAuthorInfo(id);

    if (!author) return { title: "Author Not Found | Daily News Views" };

    return {
        title: `${author.name} | Daily News Views Author`,
        description: author.bio || `Professional journalist and content creator at Daily Chronicle.`,
        openGraph: {
            title: `${author.name} | Daily News Views Author`,
            description: author.bio || `Professional journalist and content creator at Daily Chronicle.`,
            url: `${SITE_DOMAIN}/author/${id}`,
            siteName: "Daily News Views",
            type: "profile",
        },
    };
}

export default async function AuthorPage({ params }: Props) {
    const { id } = await params;

    // Fetch data in parallel
    const [author, articles, trendingHeadlines, allAds] = await Promise.all([
        getAuthorInfo(id),
        getAuthorArticles(id),
        getHeadlines(),
        getAds()
    ]);

    if (!author) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Author Not Found</h1>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-zinc-950 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return Home
                    </Link>
                </div>
            </div>
        );
    }

    // Use a placeholder if no profile image exists
    const profileImage = author.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=200&background=random`;

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans pb-24">
            {/* Header / Bio Section */}
            <div className="bg-white border-b border-zinc-200">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <img
                                src={profileImage}
                                alt={author.name}
                                className="w-full h-full rounded-full shadow-2xl border-4 border-white object-cover"
                            />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-3 uppercase tracking-tighter text-zinc-950">{author.name}</h1>
                        <p className="text-red-600 font-bold uppercase tracking-widest text-xs mb-6">
                            {author.articleCount || articles.length} Articles Published
                        </p>
                        <p className="text-xl text-zinc-500 mb-8 max-w-2xl mx-auto font-medium leading-relaxed italic">
                            {author.bio || 'Professional journalist and content creator at Daily Chronicle.'}
                        </p>

                        <div className="flex justify-center gap-4">
                            {author.socialLinks?.twitter && (
                                <a href={author.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-zinc-50 text-zinc-400 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            )}
                            {author.socialLinks?.linkedin && (
                                <a href={author.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-zinc-50 text-zinc-400 hover:bg-[#0A66C2] hover:text-white transition-all shadow-sm">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                            {author.socialLinks?.facebook && (
                                <a href={author.socialLinks.facebook} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-zinc-50 text-zinc-400 hover:bg-[#1877F2] hover:text-white transition-all shadow-sm">
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                            {author.socialLinks?.instagram && (
                                <a href={author.socialLinks.instagram} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-zinc-50 text-zinc-400 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500 hover:text-white transition-all shadow-sm">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <main className="container mx-auto px-3 sm:px-4 lg:px-8 py-12 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="lg:col-span-8">
                        <div className="flex items-center gap-3 mb-10 pb-3 border-b-2 border-zinc-200 relative">
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-950">
                                Latest Reports
                            </h2>
                            <div className="absolute bottom-[-2px] left-0 w-24 h-[3px] bg-red-600" />
                        </div>

                        {articles && articles.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {articles.map((article: any) => (
                                    <NewsCard key={article._id} article={article} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200 text-zinc-400">
                                <p className="font-black uppercase tracking-widest text-sm mb-2">No Reports Available</p>
                                <p className="text-xs font-bold uppercase tracking-tight opacity-50">This author hasn't published anything yet.</p>
                            </div>
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
