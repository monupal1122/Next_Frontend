"use client";

import Link from "next/link";
import {
  Facebook,
  Youtube,
  Instagram,
  Twitter,
  ArrowRight,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-white pt-12 md:pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
          {/* 1. Brand */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-1">
            <Link href="/">
              <img
                src="/logo1.webp"
                alt="DNV logo"
                className="h-10 md:h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs font-medium">
              Your trusted source for real-time news, breaking headlines,
              investigative journalism, and local stories from across the globe.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                {
                  Icon: Facebook,
                  href: "https://facebook.com",
                  color: "  hover:bg-blue-600",
                },
                {
                  Icon: Twitter,
                  href: "https://twitter.com",
                  color: "hover:bg-sky-500",
                },
                {
                  Icon: Instagram,
                  href: "https://instagram.com",
                  color: "hover:bg-pink-600",
                },
                {
                  Icon: Youtube,
                  href: "https://youtube.com",
                  color: "hover:bg-red-600",
                },
              ].map(({ Icon, href, color }, i) => (
                <Link
                  key={i}
                  href={href}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl bg-white text-muted-foreground ${color} hover:text-white transition-all duration-300`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                </Link>
              ))}
            </div>
          </div>

          {/* 2. Trending News */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-white mb-6 md:mb-8">
              Trending News
            </h3>
            <ul className="space-y-2.5 md:space-y-3">
              {[
                "Business",
                "National",
                "Sports",
                "Entertainment",
                "Punjab",
                "Technology",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={`/category/${item.toLowerCase()}`}
                    className="text-zinc-400 hover:text-white transition-colors text-sm font-bold block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Information */}
          <div>
            <h3 className="font-bold text-lg uppercase tracking-[0.2em] text-white hover:text-red-600 mb-6">
              Information
            </h3>
            <ul className="space-y-2.5 md:space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "About Us", path: "/about" },
                { label: "Contact Us", path: "/contact" },
                { label: "Latest News", path: "/feed" },
                { label: "Privacy Policy", path: "/privacy-policy" },
                { label: "Terms of Service", path: "/terms" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.path}
                    className="text-white hover:text-red-600 transition-colors text-lg font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Stay Updated */}
          <div className="space-y-6">
            <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-white mb-6">
              Stay Updated
            </h3>
            <p className="text-white text-sm leading-relaxed">
              Subscribe to Daily News Views for the latest breaking news
              delivered to your inbox.
            </p>
            <form className="flex flex-col gap-3">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-2xl bg-white text-lg border-none text-md placeholder:text-black focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-red-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-red-600/20 hover:shadow-red-600/30 hover:bg-red-700 transition-all active:scale-[0.98]"
              >
                Get Breaking Alerts
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-20 pt-8 border-t border-border/50 flex items-center justify-center w-full px-4">
          <p className="text-white text-lg sm:text-base md:text-[20px] text-center break-words max-w-full">
            © {new Date().getFullYear()} All rights reserved by{" "}
            <a
              href="https://nextgrowthdigital.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-600 transition whitespace-nowrap"
            >
              Next Growth Digital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
