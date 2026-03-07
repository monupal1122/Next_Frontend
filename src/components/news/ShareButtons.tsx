"use client";

import { Facebook, Twitter, Linkedin, Mail, Copy, MessageCircle, Share2, Youtube, Instagram } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface ShareButtonsProps {
    title: string;
    url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
    const handleShare = async (platform: string) => {
        const shareText = `${title}\n\nRead more at: ${url}`;
        const platforms: Record<string, string> = {
            whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText)}`,
        };

        if (platform === "copy") {
            try {
                await navigator.clipboard.writeText(url);
                toast.success("Link copied to clipboard!");
            } catch (err) {
                toast.error("Failed to copy link");
            }
            return;
        }

        if (platforms[platform]) {
            window.open(platforms[platform], "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div className="flex items-center justify-between w-full py-4 border-y border-zinc-100 mt-8 mb-12">
            <div className="flex items-center gap-3">
                {/* Facebook */}
                <button
                    onClick={() => handleShare("facebook")}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
                    title="Share on Facebook"
                >
                    <Facebook className="w-5 h-5 fill-current" />
                </button>

                {/* Twitter / X */}
                <button
                    onClick={() => handleShare("twitter")}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:opacity-90 transition-opacity"
                    title="Share on X"
                >
                    <Twitter className="w-5 h-5 fill-current" />
                </button>

                {/* LinkedIn */}
                <button
                    onClick={() => handleShare("linkedin")}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0A66C2] text-white hover:opacity-90 transition-opacity"
                    title="Share on LinkedIn"
                >
                    <Linkedin className="w-5 h-5 fill-current" />
                </button>

                {/* Mail */}
                <button
                    onClick={() => handleShare("email")}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-400 text-white hover:opacity-90 transition-opacity"
                    title="Share via Email"
                >
                    <Mail className="w-5 h-5" />
                </button>

                {/* Copy */}
                <button
                    onClick={() => handleShare("copy")}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-200 text-zinc-600 hover:bg-zinc-300 transition-colors"
                    title="Copy Link"
                >
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            {/* Community Section (Matches Screenshot) */}
            <div className="flex items-center gap-4">
                <span className="text-[13px] font-bold text-zinc-900 italic hidden sm:block">Join our community</span>
                <Link
                    href="https://whatsapp.com/channel/0029Va9D0pQ545uwJvG6mE1j"
                    target="_blank"
                    className="w-11 h-11 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                >
                    <MessageCircle className="w-6 h-6 fill-current" />
                </Link>
            </div>
        </div>
    );
}
