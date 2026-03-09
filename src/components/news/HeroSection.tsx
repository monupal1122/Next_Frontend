"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsCardSkeleton } from '@/components/news/NewsCardSkeleton';
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
    articles: any[];
    headlines?: any[];
    isLoading?: boolean;
}

export function HeroSection({ articles, headlines, isLoading }: HeroSectionProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 25 });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);

        const startAutoplay = () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                if (!isHovered) {
                    emblaApi.canScrollNext() ? emblaApi.scrollNext() : emblaApi.scrollTo(0);
                }
            }, 5000);
        };
        startAutoplay();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect, isHovered]);

    if (isLoading) {
        return (
            <section className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    <div className="w-full lg:flex-1 rounded-2xl bg-zinc-100 animate-pulse" style={{ height: 'clamp(280px, 55vw, 560px)' }} />
                    <div className="w-full lg:w-[300px] xl:w-[320px] flex flex-col gap-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <NewsCardSkeleton key={i} variant="horizontal" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!articles?.length) return null;

    const sliderArticles = articles.slice(0, 5);
    const sideArticles = (headlines && headlines.length > 0 ? headlines : articles.slice(5, 8)).slice(0, 3);

    return (
        <>
            <style>{`
                .hero-progress-bar {
                    animation: heroProg 5s linear forwards;
                    transform-origin: left;
                }
                @keyframes heroProg {
                    from { transform: scaleX(0); }
                    to   { transform: scaleX(1); }
                }
                .dot-track {
                    transition: width 0.35s cubic-bezier(0.22,1,0.36,1), background 0.25s;
                }
                .ctrl-btn {
                    transition: background 0.18s, transform 0.15s, box-shadow 0.2s;
                    -webkit-tap-highlight-color: transparent;
                }
                .ctrl-btn:hover  { background: rgba(255,255,255,1); transform: scale(1.07); box-shadow: 0 6px 20px rgba(0,0,0,0.18); }
                .ctrl-btn:active { transform: scale(0.93); }
                .side-item { transition: background 0.18s; }
                .side-item:hover { background: #fafafa; }
                .ticker-pulse { animation: tickPulse 2s ease-in-out infinite; }
                @keyframes tickPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <section className="w-full px-3 sm:px-5 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 lg:items-stretch">

                    {/* Main Slider Area */}
                    <div className="lg:flex-1 relative group h-[480px] sm:h-[520px] lg:h-[560px] min-w-0">
                        <div
                            className="overflow-hidden rounded-2xl border border-zinc-100 shadow-2xl bg-white h-full relative"
                            ref={emblaRef}
                        >
                            <div className="flex touch-pan-y h-full">
                                {sliderArticles.map((article) => (
                                    <div className="flex-[0_0_100%] min-w-0 h-full" key={article._id}>
                                        <NewsCard article={article} variant="featured" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Slider Controls — always visible on mobile, hover-only on desktop */}
                        <button
                            onClick={scrollPrev}
                            className="absolute left-4 top-1/3 md:top-1/2 -translate-y-1/2 bg-white/95 hover:bg-red-600 hover:text-white text-zinc-900 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-2xl lg:opacity-0 lg:group-hover:opacity-100 transition-all z-30 active:scale-90"
                            aria-label="Previous slide"
                        >
                            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="absolute right-4 top-1/3 md:top-1/2 -translate-y-1/2 bg-white/95 hover:bg-red-600 hover:text-white text-zinc-900 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-2xl lg:opacity-0 lg:group-hover:opacity-100 transition-all z-30 active:scale-90"
                            aria-label="Next slide"
                        >
                            <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-2.5 z-20">
                            {sliderArticles.map((_: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => emblaApi && emblaApi.scrollTo(index)}
                                    className={`h-1 sm:h-1.5 rounded-full transition-all duration-500 ${index === selectedIndex
                                        ? 'bg-red-600 w-8 sm:w-10'
                                        : 'bg-white/40 w-2 sm:w-2.5 hover:bg-white'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>


                    {/* ── SIDE PANEL – Latest Headlines ── */}
                    <div className="w-full lg:w-[400px] xl:w-[420px] flex-shrink-0 flex flex-col rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-xl">
                        {/* Header */}
                        <div className="flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-3.5" style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 100%)', borderBottom: '2px solid #ef4444' }}>
                            <span className="ticker-pulse"><Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500 fill-red-500" /></span>
                            <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-white">Latest Headlines</h3>
                            <span className="ml-auto flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 ticker-pulse" />
                                <span className="text-[9px] sm:text-[10px] text-zinc-400 uppercase tracking-widest font-medium">Live</span>
                            </span>
                        </div>

                        {/* Stories:
                            Mobile/tablet → horizontal scroll
                            Desktop → vertical list
                        */}
                        <div className="flex-1 min-h-0 flex flex-col overflow-y-auto no-scrollbar divide-y divide-zinc-100">
                            {sideArticles.map((article) => (
                                <div key={article._id} className="side-item flex-shrink-0 w-full">
                                    <NewsCard article={article} variant="horizontal" />
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex-shrink-0 border-t border-zinc-100 px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-50">
                            <Link href="/feed" className="group/cta flex items-center justify-between w-full">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover/cta:text-red-600 transition-colors">View All Stories</span>
                                <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-zinc-100 group-hover/cta:bg-red-600 transition-colors">
                                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-500 group-hover/cta:text-white transition-colors" strokeWidth={2.5} />
                                </span>
                            </Link>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}