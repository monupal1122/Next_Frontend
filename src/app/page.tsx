import { getArticlesByCategory, getFeaturedArticles, getHeadlines } from "@/lib/api";
import { HeroSection } from "@/components/news/HeroSection";
import { CategorySection } from "@/components/news/CategorySection";
import { TrendingSidebar } from "@/components/news/TrendingSidebar";
import { AdsBanner } from "@/components/news/AdsBanner";

export default async function Home() {
  const [featuredArticles, allHeadlines] = await Promise.all([
    getFeaturedArticles(),
    getHeadlines(),
  ]);

  // Ensure variety by slicing the one large headline fetch
  // If featuredArticles exists, use them for slider. Otherwise use headlines 1-5.
  const sliderData = featuredArticles.length > 0 ? featuredArticles : allHeadlines.slice(0, 5);

  // RESTORED: Fetch for exact sections from screenshot
  const [nationalArticles, punjabArticles, sportsArticles, techArticles, entertainmentArticles, businessArticles] = await Promise.all([
    getArticlesByCategory("national"),
    getArticlesByCategory("punjab"),
    getArticlesByCategory("sports"),
    getArticlesByCategory("technology"),
    getArticlesByCategory("entertainment"),
    getArticlesByCategory("business"),
  ]);

  // Use Headlines 6-8 for the Hero Sidebar
  const heroSideData = allHeadlines.slice(5, 8);

  // Use Headlines 10-15 for the "Trending Now" Sidebar to ensure no repeats
  const trendingData = allHeadlines.slice(9, 14);

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* 1. TOP HERO (Cinematic Slider) */}
      <div className="bg-white border-b border-zinc-200">
        <HeroSection
          articles={sliderData}
          headlines={heroSideData}
          isLoading={false}
        />
      </div>

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-8 space-y-24">

            {/* I. National Headlines */}
            <CategorySection
              articles={nationalArticles}
              title="National Highlights"
              categorySlug="national"
            />

            {/* Mid-Content Ad Banner (Matches Screenshot) */}
            <AdsBanner position="content" />

            {/* II. Punjab Spotlight */}
            <CategorySection
              articles={punjabArticles}
              title="Punjab Spotlight"
              categorySlug="punjab"
            />

            {/* III. Sports Center */}
            <CategorySection
              articles={sportsArticles}
              title="Sports Intelligence"
              categorySlug="sports"
            />

            {/* IV. Frontier Tech */}
            <CategorySection
              articles={techArticles}
              title="Technology & Gadgets"
              categorySlug="technology"
            />
          </div>

          {/* Sidebar (Right Column) */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Trending Sidebar (Using FRESH articles 10-15 from server) */}
            <TrendingSidebar initialArticles={trendingData} />

            {/* Sidebar Ads (Matches "Mega Sale" and "Healthcare Clinic" in Screenshot) */}
            <div className="sticky top-32 space-y-10">
              <AdsBanner position="sidebar" />

              {/* Static Secondary Mock Ad for visual balance (Ported from screenshot) */}
              <div className="rounded-2xl overflow-hidden shadow-2xl relative aspect-[4/5] group border border-zinc-100">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[15s]"
                  alt="Dental Clinic Ad"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/10 to-transparent flex flex-col justify-end p-8 text-white">
                  <span className="bg-white text-blue-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-4">Official Sponsor</span>
                  <h4 className="text-3xl font-black uppercase italic tracking-tighter leading-none mb-3 underline decoration-blue-500 decoration-4 underline-offset-4">Premium Dental Care</h4>
                  <p className="text-xs font-bold opacity-80 uppercase tracking-widest leading-relaxed">Book a consultation with DNV Plus members only.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom Impact Sections (Full Widthish) */}
        <div className="mt-24 pt-24 border-t-8 border-zinc-950 space-y-24">
          {/* V. Culture & Entertainment Grid */}
          <CategorySection
            articles={entertainmentArticles}
            title="Entertainment & Arts"
            categorySlug="entertainment"
          />

          {/* Big Banner Placement Ad */}
          <div className="py-20 bg-zinc-950 text-white text-center rounded-none overflow-hidden relative shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-transparent to-red-600/30 opacity-60" />
            <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none relative z-10 mb-6 group-hover:scale-110 transition-transform duration-700">Experience High Frequency Intel</h3>
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-red-600 relative z-10">Exclusive Membership Access Token: ACTIVE</p>
          </div>

          {/* VI. Global Business Terminal */}
          <CategorySection
            articles={businessArticles}
            title="Business Intelligence"
            categorySlug="business"
          />
        </div>
      </main>
    </div>
  );
}
