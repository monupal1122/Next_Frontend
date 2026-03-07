import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
    category: {
        name: string;
        slug: string;
        color?: string;
    };
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function CategoryBadge({ category, size = "sm", className }: CategoryBadgeProps) {
    const sizeClasses = {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
    };

    const getCategoryColor = (slug: string) => {
        const colors: Record<string, string> = {
            technology: "bg-blue-600",
            business: "bg-emerald-600",
            sports: "bg-purple-600",
            entertainment: "bg-rose-600",
            health: "bg-teal-600",
            science: "bg-cyan-600",
            politics: "bg-indigo-600",
            world: "bg-amber-600",
        };
        return colors[slug] || "bg-primary";
    };

    return (
        <span
            className={cn(
                "category-badge text-white font-bold uppercase tracking-wider transition-all duration-300",
                getCategoryColor(category.slug),
                sizeClasses[size],
                className
            )}
        >
            {category.name}
        </span>
    );
}
