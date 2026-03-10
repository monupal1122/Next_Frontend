const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://korsimnaturals.com/api";

export async function getArticle(category: string, subcategory: string, slugId: string) {
    const response = await fetch(`${API_BASE_URL}/articles/${category}/${subcategory}/${slugId}`, {
        next: { revalidate: 60 } // Cache for 60 seconds
    });
    if (!response.ok) return null;
    return response.json();
}

export async function getArticles(page = 1, limit = 10) {
    const response = await fetch(`${API_BASE_URL}/articles?page=${page}&limit=${limit}`);
    if (!response.ok) return { articles: [], total: 0 };
    return response.json();
}

export async function getFeaturedArticles() {
    const response = await fetch(`${API_BASE_URL}/articles/featured`);
    if (!response.ok) return [];
    return response.json();
}

export async function getArticlesByCategory(category: string) {
    const response = await fetch(`${API_BASE_URL}/articles/category/${category}`);
    if (!response.ok) return [];
    return response.json();
}

export async function getArticlesBySubcategory(category: string, subcategory: string) {
    const response = await fetch(`${API_BASE_URL}/articles/subcategory/${category}/${subcategory}`);
    if (!response.ok) return [];
    return response.json();
}

export async function getArticlesByTag(tag: string) {
    const response = await fetch(`${API_BASE_URL}/articles/tag/${tag}`);
    if (!response.ok) return [];
    return response.json();
}

export async function getSearchArticles(query: string) {
    if (!query.trim()) return [];
    const response = await fetch(`${API_BASE_URL}/articles/search?q=${query}`);
    if (!response.ok) return [];
    return response.json();
}

export async function getCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories/full`);
        if (!response.ok) return [];
        const data = await response.json();
        // Handle array wrap
        return Array.isArray(data) ? data : (data.categories || []);
    } catch (error) {
        console.error("Fetch Categories Error:", error);
        return [];
    }
}

export async function getHeadlines() {
    try {
        const response = await fetch(`${API_BASE_URL}/articles?page=1&limit=30`);
        if (!response.ok) return [];
        const data = await response.json();
        if (Array.isArray(data)) return data;
        return data.articles || [];
    } catch (error) {
        console.error("Fetch Headlines Error:", error);
        return [];
    }
}

export async function getAds() {
    try {
        const response = await fetch(`${API_BASE_URL}/ads/getall`, {
            next: { revalidate: 300 },
            headers: { 'Accept': 'application/json' }
        });

        // Check if response is OK
        if (!response.ok) {
            console.error(`Ads Fetch Error: Server returned status ${response.status}`);
            return [];
        }

        // Check content-type to ensure it's JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            // Response is not JSON, might be HTML error page
            const text = await response.text();
            console.error(`Ads Fetch Error: Expected JSON but got content-type: ${contentType}`);
            console.error(`Response preview: ${text.substring(0, 200)}`);
            return [];
        }

        const data = await response.json();
        const ads = Array.isArray(data) ? data : (data.ads || []);
        console.log(`Fetched ${ads.length} ads from API`);
        return ads;
    } catch (error) {
        console.error("Ads Fetch Error:", error);
        return [];
    }
}

export async function getAuthorInfo(id: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
            next: { revalidate: 300 } // Cache author info for 5 mins
        });
        if (!response.ok) return null;
        return response.json();
    } catch (error) {
        console.error("Fetch Author Info Error:", error);
        return null;
    }
}

export async function getAuthorArticles(id: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/author/${id}`, {
            next: { revalidate: 60 } // Cache articles for 1 minute like normal articles
        });
        if (!response.ok) return [];
        return response.json();
    } catch (error) {
        console.error("Fetch Author Articles Error:", error);
        return [];
    }
}