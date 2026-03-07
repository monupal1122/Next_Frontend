import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
    title: string;
    href?: string;
    badge?: string;
}

export function SectionHeader({ title, href, badge }: SectionHeaderProps) {
    return (
        <div className="section-header">
            <h2>
                {badge && (
                    <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider mb-1 block">
                        {badge}
                    </span>
                )}
                <span className="tracking-tighter">{title}</span>
            </h2>
            {href && (
                <Link
                    href={href}
                    className="view-all-btn group"
                >
                    View All <ArrowRight className="w-3.5 h-3.5 inline ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
            )}
        </div>
    );
}
