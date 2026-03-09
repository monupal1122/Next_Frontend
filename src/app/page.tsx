import { getArticlesByCategory, getFeaturedArticles, getHeadlines, getAds } from "@/lib/api";
import { HeroSection } from "@/components/news/HeroSection";
import { CategorySection } from "@/components/news/CategorySection";
import { TrendingSidebar } from "@/components/news/TrendingSidebar";
import { AdsBanner } from "@/components/news/AdsBanner";

export default async function Home() {
  const [featuredArticles, allHeadlines, allAds] = await Promise.all([
    getFeaturedArticles(),
    getHeadlines(),
    getAds(),
  ]);

  const sliderData = featuredArticles.length > 0 ? featuredArticles : allHeadlines.slice(0, 5);

  const [nationalArticles, punjabArticles, sportsArticles, techArticles, entertainmentArticles, businessArticles] = await Promise.all([
    getArticlesByCategory("national"),
    getArticlesByCategory("punjab"),
    getArticlesByCategory("sports"),
    getArticlesByCategory("technology"),
    getArticlesByCategory("entertainment"),
    getArticlesByCategory("business"),
  ]);

  // Headlines 6-8 for hero sidebar
  const heroSideData = allHeadlines.slice(5, 8);

  // Headlines 10-15 for trending sidebar
  const trendingData = allHeadlines.slice(9, 14);

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* HERO SECTION */}
      <div className="bg-white border-b border-zinc-200">
        <HeroSection
          articles={sliderData}
          headlines={heroSideData}
          isLoading={false}
        />
      </div>

      <main className="container mx-auto px-3 sm:px-4 lg:px-8 py-8 md:py-12 max-w-7xl">
        {/* ─── Two-Column Layout: Content + Sidebar ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* ── Main Content Column ── */}
          <div className="lg:col-span-8 space-y-14 md:space-y-20">

            {/* I. National Headlines */}
            <CategorySection
              articles={nationalArticles}
              title="National Highlights"
              categorySlug="national"
            />

            {/* II. Punjab Spotlight */}
            <CategorySection
              articles={punjabArticles}
              title="Punjab Spotlight"
              categorySlug="punjab"
            />

            {/* MOBILE ONLY: Inject sidebar content in natural page flow */}
            <div className="lg:hidden space-y-8">
              <TrendingSidebar initialArticles={trendingData} />
              <AdsBanner position="sidebar" initialAds={allAds} />
            </div>

            {/* III. Sports */}
            <CategorySection
              articles={sportsArticles}
              title="Sports Intelligence"
              categorySlug="sports"
            />

            {/* Mid-Content Ad */}
            <AdsBanner position="content" initialAds={allAds} />

            {/* IV. Technology */}
            <CategorySection
              articles={techArticles}
              title="Technology & Gadgets"
              categorySlug="technology"
            />
          </div>

          {/* ── Sidebar (Desktop only) ── */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 space-y-10">
              {/* Trending Now */}
              <TrendingSidebar initialArticles={trendingData} />

              {/* Sidebar Ads */}
              <AdsBanner position="sidebar" initialAds={allAds} />

            </div>
          </aside>
        </div>

        {/* ─── Full-width Sections Below ─── */}
        <div className="mt-16 md:mt-24 pt-12 md:pt-24 border-t-4 md:border-t-8 border-zinc-950 space-y-16 md:space-y-24">

          {/* V. Entertainment */}
          <CategorySection
            articles={entertainmentArticles}
            title="Entertainment & Arts"
            categorySlug="entertainment"
          />

          {/* Promo Banner */}
          <div className="py-12 md:py-20 bg-zinc-950 text-white text-center overflow-hidden relative shadow-2xl group rounded-xl md:rounded-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-transparent to-red-600/30 opacity-60" />
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none relative z-10 mb-4 md:mb-6 group-hover:scale-105 md:group-hover:scale-110 transition-transform duration-700 px-4">
              Experience High Frequency Intel
            </h3>
            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-red-500 relative z-10">
              Exclusive Membership Access Token: ACTIVE
            </p>
          </div>

          {/* VI. Business */}
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
