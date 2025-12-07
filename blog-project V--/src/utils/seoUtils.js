import { blogPosts } from '../data/blogData';

// SEO utility functions
export const generateSitemap = () => {
  const baseUrl = window.location.origin;
  const currentDate = new Date().toISOString();
  
  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/tools', priority: '0.8', changefreq: 'weekly' },
    { url: '/products', priority: '0.8', changefreq: 'weekly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' }
  ];

  // Blog posts
  const blogPages = blogPosts.map(post => ({
    url: `/blog/${post.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: post.date || currentDate
  }));

  const allPages = [...staticPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

// Generate robots.txt content
export const generateRobotsTxt = () => {
  const baseUrl = window.location.origin;
  
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin areas (if any)
Disallow: /admin/
Disallow: /private/

# Allow important directories
Allow: /blog/
Allow: /tools/
Allow: /products/
Allow: /contact/`;
};

// SEO score calculator
export const calculateSEOScore = (content) => {
  let score = 0;
  const checks = [];

  // Title length check (50-60 characters is optimal)
  if (content.title) {
    if (content.title.length >= 30 && content.title.length <= 60) {
      score += 20;
      checks.push({ type: 'success', message: 'Title length is optimal' });
    } else {
      checks.push({ type: 'warning', message: 'Title should be 30-60 characters' });
    }
  } else {
    checks.push({ type: 'error', message: 'Title is missing' });
  }

  // Description length check (150-160 characters is optimal)
  if (content.description) {
    if (content.description.length >= 120 && content.description.length <= 160) {
      score += 20;
      checks.push({ type: 'success', message: 'Meta description length is optimal' });
    } else {
      checks.push({ type: 'warning', message: 'Meta description should be 120-160 characters' });
    }
  } else {
    checks.push({ type: 'error', message: 'Meta description is missing' });
  }

  // Keywords check
  if (content.keywords && content.keywords.length > 0) {
    score += 15;
    checks.push({ type: 'success', message: 'Keywords are present' });
  } else {
    checks.push({ type: 'warning', message: 'Keywords are missing' });
  }

  // Image alt text check
  if (content.image) {
    score += 10;
    checks.push({ type: 'success', message: 'Featured image is present' });
  } else {
    checks.push({ type: 'warning', message: 'Featured image is missing' });
  }

  // Content length check (for articles)
  if (content.content) {
    const wordCount = content.content.split(' ').length;
    if (wordCount >= 300) {
      score += 15;
      checks.push({ type: 'success', message: 'Content length is sufficient' });
    } else {
      checks.push({ type: 'warning', message: 'Content should be at least 300 words' });
    }
  }

  // Internal links check
  if (content.hasInternalLinks) {
    score += 10;
    checks.push({ type: 'success', message: 'Internal links are present' });
  } else {
    checks.push({ type: 'info', message: 'Consider adding internal links' });
  }

  // Reading time check
  if (content.readTime) {
    score += 10;
    checks.push({ type: 'success', message: 'Reading time is calculated' });
  }

  return {
    score: Math.min(score, 100),
    checks,
    grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D'
  };
};

// Extract keywords from content
export const extractKeywords = (text, maxKeywords = 10) => {
  if (!text) return [];

  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
    'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
  ]);

  // Extract words and count frequency
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

// Generate meta description from content
export const generateMetaDescription = (content, maxLength = 155) => {
  if (!content) return '';

  // Remove HTML tags and extra whitespace
  const cleanContent = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  // Find the last complete sentence within the limit
  const truncated = cleanContent.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSentence > maxLength * 0.7) {
    return cleanContent.substring(0, lastSentence + 1);
  } else if (lastSpace > maxLength * 0.8) {
    return cleanContent.substring(0, lastSpace) + '...';
  } else {
    return truncated + '...';
  }
};

// URL slug generator
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
};

// Schema.org structured data generators
export const generateArticleSchema = (article) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.description || article.excerpt,
    "image": article.image ? [article.image] : undefined,
    "author": {
      "@type": "Person",
      "name": article.author || "BlogX Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BlogX",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/logo.png`
      }
    },
    "datePublished": article.date,
    "dateModified": article.modifiedDate || article.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${window.location.origin}/blog/${article.slug}`
    },
    "keywords": article.tags ? article.tags.join(', ') : undefined,
    "articleSection": article.category,
    "wordCount": article.content ? article.content.split(' ').length : undefined
  };
};

export const generateBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${window.location.origin}${crumb.url}`
    }))
  };
};