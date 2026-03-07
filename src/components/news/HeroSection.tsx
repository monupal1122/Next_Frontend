"use client";

import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { NewsCard } from '@/components/news/NewsCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
    articles: any[];
    headlines?: any[];
    isLoading?: boolean;
}

export function HeroSection({ articles, headlines, isLoading }: HeroSectionProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
    const [selectedIndex, setSelectedIndex] = useState(0);

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
                if (emblaApi.canScrollNext()) {
                    emblaApi.scrollNext();
                } else {
                    emblaApi.scrollTo(0);
                }
            }, 5000);
        };

        startAutoplay();

        return () => {
            clearInterval(intervalId);
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    if (isLoading) {
        return (
            <section className="container mx-auto px-4 py-4 md:py-8 h-[560px]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                    <div className="lg:col-span-8 min-h-[360px] md:h-full bg-zinc-200 animate-pulse rounded-xl shadow-sm" />
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 bg-zinc-100 animate-pulse rounded-xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!articles?.length) return null;

    const sliderArticles = articles.slice(0, 5);
    const sideArticles = (headlines && headlines.length > 0 ? headlines : articles).slice(0, 4);

    return (
        <section className="container mx-auto px-4 py-4 md:py-8 mb-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Main Slider Area */}
                <div className="lg:col-span-8 relative group lg:h-[560px]">
                    <div
                        className="overflow-hidden rounded-xl border border-zinc-100 shadow-sm bg-white h-full"
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

                    <button
                        onClick={scrollPrev}
                        className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-zinc-900 p-2 md:p-3 rounded-full shadow-lg opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10"
                    >
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-zinc-900 p-2 md:p-3 rounded-full shadow-lg opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10"
                    >
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {sliderArticles.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => emblaApi && emblaApi.scrollTo(index)}
                                className={`h-1.5 rounded-full transition-all ${index === selectedIndex
                                    ? 'bg-red-600 w-8'
                                    : 'bg-white/50 w-3 hover:bg-white'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Sidebar area: Latest Headlines */}
                <div className="lg:col-span-4 flex flex-col bg-white border border-zinc-100 shadow-sm rounded-xl overflow-hidden h-full max-h-[560px]">
                    <div className="bg-zinc-950 p-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-white">
                            Latest News
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-zinc-50">
                        {sideArticles.map((article) => (
                            <NewsCard key={article._id} article={article} variant="horizontal" />
                        ))}
                    </div>
                    <Link
                        href="/feed"
                        className="p-4 bg-zinc-50 border-t border-zinc-100 text-center text-[10px] font-black uppercase tracking-[0.2em] text-red-600 hover:bg-white transition-colors flex items-center justify-center gap-2"
                    >
                        View Comprehensive Feed <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
