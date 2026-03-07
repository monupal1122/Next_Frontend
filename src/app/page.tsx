import { getArticlesByCategory, getFeaturedArticles, getHeadlines } from "@/lib/api";
import { HeroSection } from "@/components/news/HeroSection";
import { CategorySection } from "@/components/news/CategorySection";
import { TrendingSidebar } from "@/components/news/TrendingSidebar";
import Image from "next/image";

export default async function Home() {
  const [featuredArticles, headlines] = await Promise.all([
    getFeaturedArticles(),
    getHeadlines(),
  ]);

  // Fetch articles for each category spotlight
  const [nationalArticles, punjabArticles, sportsArticles, techArticles, entertainmentArticles, businessArticles] = await Promise.all([
    getArticlesByCategory("national"),
    getArticlesByCategory("punjab"),
    getArticlesByCategory("sports"),
    getArticlesByCategory("technology"),
    getArticlesByCategory("entertainment"),
    getArticlesByCategory("business"),
  ]);

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* Hero Section — Matches original layout */}
      <div className="bg-white border-b border-zinc-200">
        <HeroSection
          articles={featuredArticles.length > 0 ? featuredArticles : headlines}
          headlines={headlines}
        />
      </div>

      <main className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area (Left) */}
          <div className="lg:col-span-8 space-y-24">
            {/* National Section */}
            <CategorySection
              articles={nationalArticles}
              title="National Intelligence"
              categorySlug="national"
            />

            {/* Advertisement Banner (Industry Standard) */}
            <div className="py-8 text-center bg-zinc-100 rounded-none border-y-4 border-zinc-200 shadow-inner group cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2 block">Premium Placement</span>
              <h4 className="text-xl font-black uppercase tracking-tighter text-zinc-900 group-hover:text-primary transition-colors">Experience Luxury Intelligence</h4>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2 transform group-hover:scale-105 transition-transform">Exclusive for DN Readers worldwide</p>
            </div>

            {/* Punjab Spotlight */}
            <CategorySection
              articles={punjabArticles}
              title="Punjab Spotlight"
              categorySlug="punjab"
            />

            {/* Sports Roundup */}
            <CategorySection
              articles={sportsArticles}
              title="Sports Intelligence"
              categorySlug="sports"
            />

            {/* Secondary Advertisement */}
            <div className="py-8 text-center bg-zinc-950 text-white rounded-none border-b-4 border-primary shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rotate-45 translate-x-12 -translate-y-12 transition-transform group-hover:scale-110" />
              <h4 className="text-xl font-black uppercase tracking-tighter leading-none relative z-10">Global Business Summit 2026</h4>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mt-3 relative z-10">Limited Executive Registration Open</p>
            </div>

            {/* Technology/Tech */}
            <CategorySection
              articles={techArticles}
              title="Frontier Tech Intelligence"
              categorySlug="technology"
            />
          </div>

          {/* Sidebar Area (Right) */}
          <aside className="lg:col-span-4 space-y-12 h-fit">
            <TrendingSidebar />

            {/* Sticky Sidebar Ad & Extra content */}
            <div className="sticky top-32 space-y-8">
              <div className="bg-white border border-zinc-200 shadow-sm p-8 text-center flex flex-col items-center justify-center group cursor-pointer hover:border-primary transition-colors">
                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <img src="/logo1.webp" alt="DNV" className="w-10 grayscale opacity-20 filter" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Power Your Portfolio</h4>
                <p className="text-xl font-black uppercase tracking-tighter text-zinc-900 group-hover:text-primary transition-colors">Financial Alpha for the 1%</p>
              </div>

              {/* Square Ad Placeholder */}
              <div className="relative aspect-square bg-zinc-100 overflow-hidden border border-zinc-200 group">
                <Image
                  src="https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop"
                  alt="Ad"
                  fill
                  className="object-cover transition-transform group-hover:scale-110 duration-1000"
                />
                <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                  <div className="text-white">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Sponsored</span>
                    <h4 className="text-lg font-black uppercase tracking-tighter leading-tight mt-1">Shape the Future of Technology</h4>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom Wide Sections (Entertainment & Business) — Matches Index.jsx layout */}
        <div className="mt-24 pt-16 border-t-8 border-primary space-y-24">
          <CategorySection
            articles={entertainmentArticles}
            title="Culture & Entertainment"
            categorySlug="entertainment"
          />

          <div className="py-20 bg-zinc-50 border-y border-zinc-200 relative overflow-hidden flex items-center justify-center text-center">
            <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_25%)] opacity-5 animate-pulse" />
            <div className="relative z-10 space-y-4">
              <h4 className="text-3xl font-black uppercase tracking-tighter italic text-zinc-900">Experience Luxury Travel Intelligence</h4>
              <p className="text-xs font-black uppercase tracking-[0.5em] text-primary">Curated Global Destinations Await</p>
            </div>
          </div>

          <CategorySection
            articles={businessArticles}
            title="Global Business Feed"
            categorySlug="business"
          />
        </div>
      </main>
    </div>
  );
}
