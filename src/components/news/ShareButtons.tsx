"use client";

import { Facebook, Twitter, Linkedin, Mail, Copy, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

interface ShareButtonsProps {
    title: string;
    url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
    const shareText = `${title}\n\nRead more at: ${url}`;

    const handleShare = async (platform: string) => {
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
        <div className="flex flex-row items-center justify-between w-full h-fit py-1">
            <div className="flex items-center gap-2 md:gap-3">
                {/* Facebook */}
                <button
                    onClick={() => handleShare("facebook")}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-200 text-blue-600 hover:bg-zinc-100 transition-all shadow-sm"
                    title="Share on Facebook"
                >
                    <Facebook className="w-5 h-5 fill-current" />
                </button>

                {/* X (Twitter) */}
                <button
                    onClick={() => handleShare("twitter")}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-200 text-zinc-900 hover:bg-zinc-100 transition-all shadow-sm"
                    title="Share on X"
                >
                    <Twitter className="w-5 h-5 fill-current" />
                </button>

                {/* LinkedIn */}
                <button
                    onClick={() => handleShare("linkedin")}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-200 text-blue-700 hover:bg-zinc-100 transition-all shadow-sm"
                    title="Share on LinkedIn"
                >
                    <Linkedin className="w-5 h-5 fill-current" />
                </button>

                {/* Email */}
                <button
                    onClick={() => handleShare("email")}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-200 text-zinc-400 hover:bg-zinc-100 transition-all shadow-sm"
                    title="Share via Email"
                >
                    <Mail className="w-5 h-5" />
                </button>

                {/* Copy Link */}
                <button
                    onClick={() => handleShare("copy")}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-200 text-zinc-400 hover:bg-zinc-100 transition-all shadow-sm"
                    title="Copy Link"
                >
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            {/* Community Call to Action (Matches Screenshot) */}
            <div className="flex items-center gap-2 md:gap-3">
                <span className="font-bold text-zinc-900 text-[10px] md:text-sm whitespace-nowrap hidden sm:inline italic">
                    Join our community
                </span>
                <a
                    href="https://whatsapp.com/channel/YOUR_CHANNEL_ID"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-full transition-transform hover:scale-110 shadow-lg"
                    title="Join WhatsApp Channel"
                >
                    <MessageCircle className="w-6 h-6 fill-current" />
                </a>
            </div>
        </div>
    );
}
