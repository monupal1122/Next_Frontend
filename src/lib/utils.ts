import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Safely format a date string or Date object
 */
export function safeFormatDate(dateStr: any, formatStr: string = "MMM d, yyyy") {
    if (!dateStr) return "";
    try {
        const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
        if (isValid(date)) {
            return format(date, formatStr);
        }
        return "";
    } catch (e) {
        return "";
    }
}

/**
 * Convert relative image paths from the API into absolute URLs for social sharing and rendering.
 */
export function toAbsoluteUrl(url: string | undefined): string {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://admin.korsimnaturals.com/api";

    if (!url) return "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?q=80&w=1000&auto=format&fit=crop";

    // If it's already an absolute URL, return it as is or force https if needed
    if (url.startsWith("http://") || url.startsWith("https://")) {
        // Social media platforms prefer https. If possible, upgrade http to https.
        return url.replace("http://admin.korsimnaturals.com", "https://admin.korsimnaturals.com");
    }

    // Use absolute protocol if possible to avoid bot crawlers failing
    const baseHost = API_URL.replace(/\/api$/, "");

    // Clean common relative path prefixes
    const cleanPath = url.replace(/^(public|uploads)[\\/]/, "").replace(/\\/g, "/");

    // Ensure 'uploads' is in the path correctly
    const finalPath = cleanPath.startsWith("/") ? cleanPath : `/uploads/${cleanPath}`;

    // Combine and ensure https for production
    const fullUrl = `${baseHost}${finalPath}`;

    // If we are on production (admin.korsimnaturals.com), force https for social previews
    if (fullUrl.includes("admin.korsimnaturals.com")) {
        return fullUrl.replace("http://", "https://");
    }

    return fullUrl;
}

/**
 * Calculate reading time based on content length
 */
export function calculateReadingTime(content: string | undefined) {
    const wordsPerMinute = 200;
    if (!content) return 1;
    const text = typeof content === 'string' ? content.replace(/<[^>]*>/g, "") : "";
    const wordCount = text.trim().split(/\s+/).length || 1;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
