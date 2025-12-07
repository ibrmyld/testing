import { useEffect } from 'react';

const useSEO = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  tags = [],
  category,
  readTime,
  noIndex = false
}) => {
  useEffect(() => {
    // Site title
    const siteTitle = 'BlogX - AI-Powered Blog Platform';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    document.title = fullTitle;

    // Remove existing meta tags
    const existingMetas = document.querySelectorAll('meta[data-seo="true"]');
    existingMetas.forEach(meta => meta.remove());

    // Helper function to create meta tags
    const createMeta = (name, content, property = false) => {
      if (!content) return;
      
      const meta = document.createElement('meta');
      if (property) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      meta.setAttribute('content', content);
      meta.setAttribute('data-seo', 'true');
      document.head.appendChild(meta);
    };

    // Basic meta tags
    createMeta('description', description);
    createMeta('keywords', keywords.join(', '));
    createMeta('author', author || 'BlogX Team');
    
    // Robots meta
    if (noIndex) {
      createMeta('robots', 'noindex, nofollow');
    } else {
      createMeta('robots', 'index, follow');
    }

    // Open Graph tags
    createMeta('og:title', fullTitle, true);
    createMeta('og:description', description, true);
    createMeta('og:type', type, true);
    createMeta('og:url', url || window.location.href, true);
    createMeta('og:site_name', siteTitle, true);
    createMeta('og:locale', 'tr_TR', true);
    
    if (image) {
      createMeta('og:image', image, true);
      createMeta('og:image:alt', title || 'BlogX Image', true);
      createMeta('og:image:width', '1200', true);
      createMeta('og:image:height', '630', true);
    }

    // Article specific tags
    if (type === 'article') {
      createMeta('article:author', author, true);
      createMeta('article:published_time', publishedTime, true);
      createMeta('article:modified_time', modifiedTime, true);
      createMeta('article:section', category, true);
      
      tags.forEach(tag => {
        createMeta('article:tag', tag, true);
      });
    }

    // Twitter Card tags
    createMeta('twitter:card', 'summary_large_image');
    createMeta('twitter:title', fullTitle);
    createMeta('twitter:description', description);
    createMeta('twitter:site', '@BlogX');
    createMeta('twitter:creator', '@BlogX');
    
    if (image) {
      createMeta('twitter:image', image);
      createMeta('twitter:image:alt', title || 'BlogX Image');
    }

    // Additional meta tags
    createMeta('theme-color', '#3B82F6');
    createMeta('msapplication-TileColor', '#3B82F6');
    
    // Reading time for articles
    if (readTime && type === 'article') {
      createMeta('article:reading_time', readTime);
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', url || window.location.href);

    // JSON-LD Structured Data
    const createStructuredData = () => {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"][data-seo="true"]');
      if (existingScript) {
        existingScript.remove();
      }

      let structuredData;

      if (type === 'article') {
        structuredData = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": title,
          "description": description,
          "image": image ? [image] : undefined,
          "author": {
            "@type": "Person",
            "name": author || "BlogX Team"
          },
          "publisher": {
            "@type": "Organization",
            "name": "BlogX",
            "logo": {
              "@type": "ImageObject",
              "url": `${window.location.origin}/logo.png`
            }
          },
          "datePublished": publishedTime,
          "dateModified": modifiedTime || publishedTime,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url || window.location.href
          },
          "keywords": keywords.join(', '),
          "articleSection": category,
          "wordCount": readTime ? parseInt(readTime) * 200 : undefined
        };
      } else {
        structuredData = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": siteTitle,
          "description": description || "AI-Powered Blog Platform with cutting-edge content",
          "url": window.location.origin,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        };
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    };

    createStructuredData();

    // Cleanup function
    return () => {
      // Meta tags will be cleaned up on next render
    };
  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime, tags, category, readTime, noIndex]);
};

export default useSEO;