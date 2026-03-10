"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    ease?: any;
    splitType?: string;
    from?: any;
    to?: any;
    threshold?: number;
    rootMargin?: string;
    textAlign?: string;
    onLetterAnimationComplete?: () => void;
    showCallback?: boolean;
}

export default function SplitText({
    text,
    className = '',
    delay = 50,
    duration = 0.25,
    from = { opacity: 0, y: 40 },
    to = { opacity: 1, y: 0 },
    textAlign = 'center',
    onLetterAnimationComplete
}: SplitTextProps) {
    const letters = text.split('');
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start("visible").then(() => {
                if (onLetterAnimationComplete) onLetterAnimationComplete();
            });
        }
    }, [isInView, controls, onLetterAnimationComplete]);

    return (
        <span ref={ref} className={`inline-block ${className}`} style={{ textAlign: textAlign as any }}>
            {letters.map((char: string, index: number) => (
                <motion.span
                    key={index}
                    className="inline-block whitespace-pre"
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: from,
                        visible: {
                            ...to,
                            transition: {
                                duration: duration,
                                delay: (delay / 1000) * index,
                            }
                        }
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
}
