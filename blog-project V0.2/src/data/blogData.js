export const blogPosts = [
  {
    id: 1,
    title: "Building the Future with AI",
    slug: "building-future-with-ai",
    excerpt: "Exploring how artificial intelligence is reshaping the way we build software and create digital experiences.",
    content: `# Building the Future with AI

Artificial Intelligence is no longer a distant dream—it's here, and it's transforming everything we know about software development.

## The Revolution is Now

From code generation to automated testing, AI is becoming an integral part of the development workflow. Tools like GitHub Copilot and ChatGPT are changing how we write code, debug issues, and even design user interfaces.

## Key Areas of Impact

### 1. Code Generation
AI can now write entire functions, classes, and even complete applications based on simple descriptions.

### 2. Bug Detection
Advanced AI models can identify potential security vulnerabilities and performance issues before they become problems.

### 3. User Experience
AI-powered analytics help us understand user behavior and optimize interfaces for better engagement.

## Looking Forward

The future of development is collaborative—humans and AI working together to create better, faster, and more innovative solutions.`,
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
    content: `# Modern Web Development Best Practices

Web development has evolved significantly over the past few years. Here are the essential practices you should follow in 2024.

## Performance First

### Optimize Bundle Size
- Use tree shaking to eliminate dead code
- Implement code splitting for better loading times
- Compress images and use modern formats like WebP

### Core Web Vitals
Focus on the three key metrics:
- **Largest Contentful Paint (LCP)**: Should occur within 2.5 seconds
- **First Input Delay (FID)**: Should be less than 100 milliseconds
- **Cumulative Layout Shift (CLS)**: Should be less than 0.1

## Security Considerations

### Authentication
- Implement proper JWT token handling
- Use secure HTTP-only cookies
- Add rate limiting to prevent abuse

### Data Protection
- Sanitize all user inputs
- Use HTTPS everywhere
- Implement proper CORS policies

## Developer Experience

### Code Quality
- Use TypeScript for better type safety
- Implement comprehensive testing (unit, integration, e2e)
- Set up proper linting and formatting

### Tooling
- Use modern build tools like Vite or Webpack 5
- Implement hot module replacement for faster development
- Set up automated CI/CD pipelines`,
    author: "Code Master",
    publishedAt: "2024-01-12",
    readTime: "8 min read",
    category: "Web Development",
    tags: ["Best Practices", "Performance", "Security"],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    views: 890,
    comments: [
      {
        id: 1,
        author: "DevEnthusiast",
        content: "Great article! The performance tips are really helpful.",
        publishedAt: "2024-01-13"
      }
    ]
  }
];

export const categories = [
  "All",
  "Technology",
  "Web Development", 
  "3D Graphics",
  "Cybersecurity",
  "AI & Machine Learning"
];

export const tags = [
  "AI", "Development", "Future", "Best Practices", "Performance", 
  "Security", "3D", "WebGL", "Three.js", "Immersive", "Threats", "Defense"
];