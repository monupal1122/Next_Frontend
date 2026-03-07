export default function About() {
    return (
        <div className="bg-[#f5f3f3] min-h-screen py-20 px-4">
            <div className="container mx-auto max-w-4xl bg-white p-12 md:p-20 rounded-3xl shadow-sm border border-border/50">
                <h1 className="text-4xl md:text-6xl font-black text-primary mb-8 tracking-tighter uppercase line-tight">
                    About Daily News Views
                </h1>
                <p className="text-xl text-zinc-600 mb-12 leading-relaxed">
                    Stay ahead with the latest news, in-depth analysis, and breaking stories from around the world. Our mission is to provide accurate, timely, and unbiased news to our global audience.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-2xl font-black text-primary mb-4 uppercase tracking-tighter">Our Mission</h3>
                        <p className="text-zinc-500 leading-relaxed font-medium">To deliver news that matters, empowering our readers with knowledge and insights that shape their world.</p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-primary mb-4 uppercase tracking-tighter">Our Values</h3>
                        <p className="text-zinc-500 leading-relaxed font-medium">Integrity, accuracy, and independent journalism are the cornerstones of everything we do.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
