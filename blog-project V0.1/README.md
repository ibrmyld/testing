# BlogX - AI-Powered Blog Platform

Modern, responsive blog platform built with React, Vite, and Tailwind CSS.

## Features

### ✅ Implemented
- **Blog System**: Create, read, and manage blog posts
- **Categories & Tags**: Organize and filter content
- **Comments**: Interactive comment system for each post
- **Responsive Design**: Mobile-friendly interface
- **Dark Mode**: Toggle between light and dark themes
- **Search**: Find articles by title, content, or tags
- **Modern UI**: Clean design with Framer Motion animations

### 🔄 Core Functionality
- Blog post creation and management
- Category-based filtering
- Tag system for content organization
- Comment system with real-time updates
- Responsive navigation
- Search functionality
- Social sharing buttons

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Project Structure

```
blog-project/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── BlogCard.jsx
│   │   ├── CategoryFilter.jsx
│   │   ├── CommentSection.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Blog.jsx
│   │   ├── BlogPost.jsx
│   │   ├── Tools.jsx
│   │   ├── Products.jsx
│   │   └── Contact.jsx
│   ├── data/
│   │   └── blogData.js
│   ├── assets/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Features Overview

### Blog Management
- Create and publish blog posts
- Rich content with markdown-style formatting
- Category and tag organization
- View counts and reading time estimates

### User Interaction
- Comment system for each post
- Social sharing (Twitter, Facebook, LinkedIn)
- Search and filter functionality
- Responsive design for all devices

### Design Features
- Modern, clean interface
- Dark/light mode toggle
- Smooth animations with Framer Motion
- Neon green accent color theme
- Mobile-first responsive design

## Customization

### Adding New Blog Posts
Edit `src/data/blogData.js` to add new blog posts:

```javascript
{
  id: 5,
  title: "Your New Post",
  slug: "your-new-post",
  excerpt: "Brief description...",
  content: "Full content in markdown format...",
  author: "Author Name",
  publishedAt: "2024-01-20",
  readTime: "5 min read",
  category: "Technology",
  tags: ["React", "JavaScript"],
  image: "image-url",
  views: 0,
  comments: []
}
```

### Styling
The project uses Tailwind CSS with a custom color scheme. Main colors:
- Primary: Neon green (#22c55e)
- Dark theme: Custom dark color palette
- Responsive breakpoints: sm, md, lg, xl

## Deployment

### Recommended Platforms
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Use GitHub Actions for deployment

### Build Command
```bash
npm run build
```

## Future Enhancements

- Backend integration with FastAPI
- User authentication system
- Admin panel for content management
- AI-powered content generation
- Premium content system
- Newsletter subscription
- SEO optimization
- Performance analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.