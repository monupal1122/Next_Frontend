"use client";

import { useState, useEffect, useCallback } from 'react';
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

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);

        let intervalId: NodeJS.Timeout;
        const startAutoplay = () => {
            intervalId = setInterval(() => {
                if (!isHovered) {
                    emblaApi.canScrollNext() ? emblaApi.scrollNext() : emblaApi.scrollTo(0);
                }
            }, 5000);
        };
        startAutoplay();

        return () => {
            clearInterval(intervalId);
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect, isHovered]);

    if (isLoading) {
        return (
            <section className="container mx-auto px-4 py-6 md:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-8 h-[420px] md:h-[580px] bg-zinc-100 animate-pulse rounded-2xl" />
                    <div className="lg:col-span-4 flex flex-col gap-3">
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
            {/* Inject keyframe styles */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

                .hero-slide-enter {
                    animation: slideReveal 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
                }
                @keyframes slideReveal {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .dot-track {
                    transition: width 0.35s cubic-bezier(0.22,1,0.36,1), background 0.25s;
                }
                .side-item {
                    transition: background 0.2s, transform 0.2s;
                }
                .side-item:hover {
                    background: #fafafa;
                    transform: translateX(3px);
                }
                .ctrl-btn {
                    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
                }
                .ctrl-btn:hover {
                    transform: scale(1.08);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
                }
                .ctrl-btn:active {
                    transform: scale(0.96);
                }
                .progress-bar {
                    animation: progressSweep 5s linear infinite;
                    transform-origin: left;
                }
                @keyframes progressSweep {
                    from { transform: scaleX(0); }
                    to   { transform: scaleX(1); }
                }
                .ticker-pulse {
                    animation: tickerPulse 2s ease-in-out infinite;
                }
                @keyframes tickerPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <section
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="container mx-auto px-4 py-5 md:py-8 mb-6"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">

                    {/* ── MAIN SLIDER ── */}
                    <div
                        className="lg:col-span-8 relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Slider container */}
                        <div
                            className="overflow-hidden rounded-2xl shadow-xl bg-black"
                            style={{ height: 'clamp(340px, 56vw, 580px)' }}
                            ref={emblaRef}
                        >
                            <div className="flex touch-pan-y h-full">
                                {sliderArticles.map((article) => (
                                    <div
                                        className="flex-[0_0_100%] min-w-0 h-full relative"
                                        key={article._id}
                                    >
                                        <NewsCard article={article} variant="featured" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Thin progress bar at top */}
                        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl overflow-hidden z-30 pointer-events-none">
                            <div
                                key={selectedIndex}
                                className="progress-bar h-full bg-red-500"
                            />
                        </div>

                        {/* Controls */}
                        <button
                            onClick={scrollPrev}
                            aria-label="Previous slide"
                            className="ctrl-btn absolute left-3 top-1/2 -translate-y-1/2 z-20
                                       bg-white/95 text-zinc-900 rounded-full
                                       p-2.5 md:p-3 shadow-md
                                       opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                            style={{ backdropFilter: 'blur(8px)' }}
                        >
                            <ArrowLeft className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={scrollNext}
                            aria-label="Next slide"
                            className="ctrl-btn absolute right-3 top-1/2 -translate-y-1/2 z-20
                                       bg-white/95 text-zinc-900 rounded-full
                                       p-2.5 md:p-3 shadow-md
                                       opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                            style={{ backdropFilter: 'blur(8px)' }}
                        >
                            <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={2.5} />
                        </button>

                        {/* Slide counter + dots */}
                        <div className="absolute bottom-4 left-0 right-0 px-5 flex items-center justify-between z-20 pointer-events-none">
                            {/* Counter badge */}
                            <span
                                className="text-[11px] font-semibold tracking-widest text-white/80 bg-black/40 px-2.5 py-1 rounded-full"
                                style={{ backdropFilter: 'blur(8px)', letterSpacing: '0.12em' }}
                            >
                                {String(selectedIndex + 1).padStart(2, '0')} / {String(sliderArticles.length).padStart(2, '0')}
                            </span>

                            {/* Dots */}
                            <div className="flex gap-1.5 items-center pointer-events-auto">
                                {sliderArticles.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => emblaApi && emblaApi.scrollTo(i)}
                                        aria-label={`Go to slide ${i + 1}`}
                                        className={`dot-track h-[3px] rounded-full ${
                                            i === selectedIndex
                                                ? 'bg-red-500 w-7'
                                                : 'bg-white/50 w-3 hover:bg-white/80'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── SIDE PANEL ── */}
                    <div
                        className="lg:col-span-4 flex flex-col rounded-2xl overflow-hidden shadow-lg border border-zinc-200/70"
                        style={{
                            height: 'clamp(340px, 56vw, 580px)',
                            background: '#fff',
                        }}
                    >
                        {/* Header */}
                        <div
                            className="flex-shrink-0 flex items-center gap-2.5 px-4 py-3.5"
                            style={{
                                background: 'linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 100%)',
                                borderBottom: '2px solid #ef4444',
                            }}
                        >
                            <span className="ticker-pulse">
                                <Zap className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                            </span>
                            <h3
                                style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    letterSpacing: '0.15em',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                }}
                                className="uppercase text-white tracking-widest"
                            >
                                Latest Headlines
                            </h3>
                            {/* Live dot */}
                            <span className="ml-auto flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 ticker-pulse" />
                                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">Live</span>
                            </span>
                        </div>

                        {/* Articles list */}
                        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-zinc-100/80">
                            {sideArticles.map((article, idx) => (
                                <div
                                    key={article._id}
                                    className="side-item relative"
                                >
                                    {/* Story number accent */}
                                    
                                    <div className="pl-2">
                                        <NewsCard article={article} variant="horizontal" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer CTA */}
                        <div className="flex-shrink-0 border-t border-zinc-100 px-4 py-3 bg-zinc-50/80">
                            <Link
                                href="/search"
                                className="group/cta flex items-center justify-between w-full"
                            >
                                <span
                                    style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.12em', fontSize: '10px' }}
                                    className="uppercase font-bold text-zinc-400 tracking-widest group-hover/cta:text-red-600 transition-colors"
                                >
                                    View All Stories
                                </span>
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 group-hover/cta:bg-red-600 transition-colors">
                                    <ArrowRight className="w-3 h-3 text-zinc-500 group-hover/cta:text-white transition-colors" strokeWidth={2.5} />
                                </span>
                            </Link>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}