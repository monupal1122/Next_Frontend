import { getArticlesByCategory, getFeaturedArticles, getHeadlines, getAds } from "@/lib/api";
import { HeroSection } from "@/components/news/HeroSection";
import { CategorySection } from "@/components/news/CategorySection";
import { TrendingSidebar } from "@/components/news/TrendingSidebar";
import { AdsBanner } from "@/components/news/AdsBanner";
import AnimatedContent from "@/components/AnimatedContent";

export default async function Home() {
  const [
    featuredArticles,
    allHeadlines,
    allAds,
    nationalArticles,
    punjabArticles,
    sportsArticles,
    techArticles,
    entertainmentArticles,
    businessArticles
  ] = await Promise.all([
    getFeaturedArticles(),
    getHeadlines(),
    getAds(),
    getArticlesByCategory("national"),
    getArticlesByCategory("punjab"),
    getArticlesByCategory("sports"),
    getArticlesByCategory("technology"),
    getArticlesByCategory("entertainment"),
    getArticlesByCategory("business"),
  ]);

  const sliderData = featuredArticles.length > 0 ? featuredArticles : allHeadlines.slice(0, 5);

  // Headlines 6-8 for hero sidebar
  const heroSideData = allHeadlines.slice(5, 8);

  // Headlines 10-15 for trending sidebar
  const trendingData = allHeadlines.slice(9, 14);

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* Hero Section - High Impact */}
      <AnimatedContent direction="vertical" distance={30}>
        <div className="bg-white border-b border-zinc-200">
          <HeroSection
            articles={sliderData}
            headlines={heroSideData}
            isLoading={false}
          />
        </div>
      </AnimatedContent>

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-20">
            <AnimatedContent delay={0.1}>
              <CategorySection
                articles={nationalArticles}
                title="National Headlines"
                categorySlug="national"
              />
            </AnimatedContent>

            {/* Middle Ad Break */}
            <AnimatedContent delay={0.2}>
              <div className="py-5 flex justify-center">
                <AdsBanner position="content" initialAds={allAds} />
              </div>
            </AnimatedContent>

            <AnimatedContent>
              <CategorySection
                articles={punjabArticles}
                title="Punjab Spotlight"
                categorySlug="punjab"
              />
            </AnimatedContent>

            <AnimatedContent>
              <CategorySection
                articles={sportsArticles}
                title="Sports"
                categorySlug="sports"
              />
            </AnimatedContent>

            <AnimatedContent>
              <div className="py-5 flex justify-center">
                <AdsBanner position="content" initialAds={allAds} />
              </div>
            </AnimatedContent>

            <AnimatedContent>
              <CategorySection
                articles={techArticles}
                title="Tech"
                categorySlug="technology"
              />
            </AnimatedContent>
          </div>

          {/* Sidebar (Right) */}
          <aside className="lg:col-span-4 space-y-8">
            <AnimatedContent direction="horizontal" distance={30} delay={0.3}>
              <TrendingSidebar initialArticles={trendingData} />
            </AnimatedContent>

            <div className="sticky top-28 space-y-8">
              <AnimatedContent direction="horizontal" distance={30} delay={0.4}>
                <AdsBanner position="sidebar" initialAds={allAds} />
              </AnimatedContent>

              {/* Square Ad Demonstration */}
              <AnimatedContent direction="horizontal" distance={30} delay={0.5}>
                <div className="flex justify-center mt-4">
                  <AdsBanner position="sidebar" initialAds={allAds} />
                </div>
              </AnimatedContent>
            </div>
          </aside>
        </div>

        {/* Bottom Section */}
        <div className="mt-20 pt-12 border-t-8 border-zinc-950 space-y-16">
          <AnimatedContent>
            <CategorySection
              articles={entertainmentArticles}
              title="Culture & Entertainment"
              categorySlug="entertainment"
            />
          </AnimatedContent>

          <AnimatedContent>
            <div className="flex justify-center">
              <AdsBanner position="content" initialAds={allAds} />
            </div>
          </AnimatedContent>

          <AnimatedContent>
            <CategorySection
              articles={businessArticles}
              title="Global Business"
              categorySlug="business"
            />
          </AnimatedContent>
        </div>
      </main>
    </div>
  );
}
