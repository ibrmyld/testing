// API Base URL - environment'a göre ayarla
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     (import.meta.env.PROD ? 
                      'https://your-backend-url.railway.app/api' : 
                      'http://localhost:8000/api');

// Fallback data - backend çalışmazsa kullanılacak
const fallbackData = {
  posts: [
    {
      id: 1,
      title: "Building the Future with AI",
      slug: "building-future-with-ai",
      excerpt: "Exploring how artificial intelligence is reshaping the way we build software and create digital experiences.",
      content: "# Building the Future with AI\n\nArtificial Intelligence is no longer a distant dream—it's here, and it's transforming everything we know about software development.",
      author: "Tech Explorer",
      publishedAt: "2024-01-15",
      readTime: "5 min read",
      category: "Technology",
      tags: ["AI", "Development", "Future"],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      views: 1250,
      comments: []
    },
    {
      id: 2,
      title: "Modern Web Development Best Practices",
      slug: "modern-web-development-best-practices",
      excerpt: "Essential practices every web developer should follow in 2024 to build scalable and maintainable applications.",
      content: "# Modern Web Development Best Practices\n\nWeb development has evolved significantly over the past few years. Here are the essential practices you should follow in 2024.",
      author: "Code Master",
      publishedAt: "2024-01-12",
      readTime: "8 min read",
      category: "Web Development",
      tags: ["Best Practices", "Performance", "Security"],
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
      views: 890,
      comments: []
    }
  ],
  categories: ["All", "Technology", "Web Development", "3D Graphics", "Cybersecurity", "AI & Machine Learning"]
};

class ApiService {
  // Blog posts
  static async getPosts(category = null, search = null) {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.append('category', category);
      if (search) params.append('search', search);
      
      const response = await fetch(`${API_BASE_URL}/posts?${params}`);
      if (!response.ok) throw new Error('Backend not available');
      return response.json();
    } catch (error) {
      console.warn('Backend API unavailable, using fallback data:', error.message);
      // Fallback: local data kullan
      let posts = fallbackData.posts;
      
      if (category && category !== 'All') {
        posts = posts.filter(post => post.category === category);
      }
      
      if (search) {
        posts = posts.filter(post =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      return posts;
    }
  }

  static async getPost(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${slug}`);
      if (!response.ok) throw new Error('Backend not available');
      return response.json();
    } catch (error) {
      console.warn('Backend API unavailable, using fallback data:', error.message);
      const post = fallbackData.posts.find(p => p.slug === slug);
      if (!post) throw new Error('Post not found');
      return post;
    }
  }

  // Categories
  static async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Backend not available');
      return response.json();
    } catch (error) {
      console.warn('Backend API unavailable, using fallback data:', error.message);
      return { categories: fallbackData.categories };
    }
  }

  // Comments
  static async addComment(postId, comment) {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    });
    if (!response.ok) throw new Error('Failed to add comment');
    return response.json();
  }

  // Newsletter
  static async subscribeNewsletter(email) {
    const response = await fetch(`${API_BASE_URL}/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error('Failed to subscribe');
    return response.json();
  }

  // Stats
  static async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  }
}

export default ApiService; 