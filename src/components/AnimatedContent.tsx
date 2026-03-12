"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedContentProps {
    children: ReactNode;
    distance?: number;
    direction?: "vertical" | "horizontal";
    reverse?: boolean;
    duration?: number;
    delay?: number;
    className?: string;
    threshold?: number;
}

export default function AnimatedContent({
    children,
    distance = 50,
    direction = "vertical",
    reverse = false,
    duration = 0.6,
    delay = 0,
    className = "",
    threshold = 0.1,
}: AnimatedContentProps) {
    const axis = direction === "horizontal" ? "x" : "y";
    const offset = reverse ? -distance : distance;

    return (
        <motion.div
            initial={{
                opacity: 0,
                [axis]: offset,
            }}
            whileInView={{
                opacity: 1,
                [axis]: 0,
            }}
            viewport={{ once: true, amount: threshold }}
            transition={{
                duration,
                delay,
                ease: "easeOut",
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
