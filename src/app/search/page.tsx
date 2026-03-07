import { Suspense } from "react";
import { SearchClient } from "@/components/search/SearchClient";
import { Loader2 } from "lucide-react";

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <Suspense fallback={
                <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-zinc-400">
                    <Loader2 className="w-12 h-12 animate-spin mb-4 text-red-600" />
                    <p className="font-black uppercase tracking-widest text-sm">Initializing Secure Search Protocol...</p>
                </div>
            }>
                <SearchClient />
            </Suspense>
        </div>
    );
}
