# VietnamLLM Blog

A modern blog built with [Nextra](https://nextra.site) - a powerful static site generator framework based on Next.js.

## 🚀 Features

- **Markdown & MDX Support**: Write content in markdown with React component support
- **Blog Theme**: Beautiful, responsive blog theme optimized for readability
- **SEO Friendly**: Automatic meta tags, sitemap generation
- **Fast Performance**: Built on Next.js for optimal performance
- **Easy Content Management**: Simple file-based content management
- **Syntax Highlighting**: Beautiful code highlighting for multiple languages
- **Math Support**: KaTeX support for mathematical expressions
- **Dark/Light Mode**: Theme switching support

## 📁 Project Structure

```
vietnamllm.github.io/
├── pages/
│   ├── posts/           # Blog posts (.md/.mdx files)
│   ├── about.mdx        # About page
│   └── index.mdx        # Homepage
├── scripts/
│   └── new-post.js      # Script to create new blog posts
├── templates/
│   └── blog-post.md     # Template for new posts
├── theme.config.jsx     # Nextra theme configuration
├── next.config.js       # Next.js configuration
└── package.json
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/VietnamLLM/vietnamllm.github.io.git
cd vietnamllm.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## ✏️ Creating Content

### Method 1: Using the Script (Recommended)

Create a new blog post interactively:

```bash
npm run new-post
```

The script will ask for:
- Post title
- Description
- Author name
- Tags

### Method 2: Manual Creation

1. Create a new `.md` or `.mdx` file in `pages/posts/`
2. Add frontmatter with metadata:

```markdown
---
title: Your Post Title
date: 2025/09/27
description: Brief description for SEO
tag: tag1, tag2, tag3
author: Your Name
---

# Your Post Title

Your content here...
```

### Method 3: Using Template

Copy the template file:

```bash
cp templates/blog-post.md pages/posts/your-new-post.md
```

Then edit the file with your content.

## 📝 Writing Guidelines

### Frontmatter Fields

- `title`: Post title (required)
- `date`: Publication date in YYYY/MM/DD format (required)
- `description`: SEO description (recommended)
- `tag`: Comma-separated tags (optional)
- `author`: Author name (optional)

### Markdown Features

- **Headers**: Use `#`, `##`, `###` for headings
- **Code blocks**: Use triple backticks with language specification
- **Math**: Use `$inline math$` or `$$block math$$`
- **Links**: `[text](url)`
- **Images**: `![alt](url)`
- **Lists**: Use `-` or `1.` for lists
- **Tables**: Standard markdown table syntax

### MDX Components

You can use React components in `.mdx` files:

```mdx
import { Callout } from 'nextra/components'

<Callout type="info">
This is an info callout
</Callout>
```

## 🎨 Customization

### Theme Configuration

Edit `theme.config.jsx` to customize:

- Site footer
- Navigation links
- Meta tags
- Dark mode settings

### Styling

The blog uses Nextra's built-in styling. For custom styles:

1. Create CSS modules in a `styles/` directory
2. Import and use in your components
3. Use Tailwind CSS classes (if enabled)

## 🚀 Deployment

### GitHub Pages

1. Build the static site:
```bash
npm run build
npm run export
```

2. Deploy the `out/` directory to GitHub Pages

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on every push to main

### Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `out`

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run new-post` - Create new blog post interactively

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-post`
3. Make your changes
4. Commit: `git commit -am 'Add new post'`
5. Push: `git push origin feature/new-post`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Nextra Documentation](https://nextra.site)
- [Next.js Documentation](https://nextjs.org/docs)
- [Markdown Guide](https://www.markdownguide.org/)
- [VietnamLLM GitHub](https://github.com/VietnamLLM)

---

Built with ❤️ by the VietnamLLM community
vietnamllm.github.io
