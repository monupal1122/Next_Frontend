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
        const response = await fetch(`${API_BASE_URL}/articles?page=1&limit=10`);
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
        const response = await fetch(`${API_BASE_URL}/ads`, { next: { revalidate: 300 } });
        if (!response.ok) return [];
        return response.json();
    } catch (error) {
        console.error("Ads Fetch Error:", error);
        return [];
    }
}
