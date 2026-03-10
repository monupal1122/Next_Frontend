"use client";

import React, { useEffect, useState, useRef } from 'react';

export function AnimatedCounter({ value, duration = 2000 }: { value: string, duration?: number }) {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const elementRef = useRef<HTMLSpanElement>(null);

    const match = value.match(/(\d+)(.*)/);
    const target = match ? parseInt(match[1]) : 0;
    const suffix = match ? match[2] : "";

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasStarted(true);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!hasStarted) return;

        let startTime: number | null = null;
        let animationFrame: number;

        const updateCount = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease out quad
            const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setCount(Math.floor(easedProgress * target));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(updateCount);
            }
        };

        animationFrame = requestAnimationFrame(updateCount);
        return () => cancelAnimationFrame(animationFrame);
    }, [hasStarted, target, duration]);

    return (
        <span ref={elementRef}>
            {count}
            {suffix}
        </span>
    );
}
