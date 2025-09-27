import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const SITE_URL = 'https://vietnamllm.github.io';

// Function to extract frontmatter from MDX files
function extractFrontmatter(content: string) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return {};
  
  const frontmatter: Record<string, string> = {};
  const lines = match[1].split('\n');
  
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      frontmatter[key.trim()] = value;
    }
  }
  
  return frontmatter;
}

// Function to get all MDX files recursively
async function getMDXFiles(dir: string, baseDir: string = dir): Promise<Array<{path: string, relativePath: string}>> {
  const files: Array<{path: string, relativePath: string}> = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relativePath = fullPath.replace(baseDir + '/', '');
      
      if (entry.isDirectory()) {
        const subFiles = await getMDXFiles(fullPath, baseDir);
        files.push(...subFiles);
      } else if (entry.name.endsWith('.mdx')) {
        files.push({
          path: fullPath,
          relativePath: relativePath
        });
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}:`, error);
  }
  
  return files;
}

// Function to convert file path to URL path
function filePathToUrlPath(filePath: string): string {
  // Remove .mdx extension
  let urlPath = filePath.replace(/\.mdx$/, '');
  
  // Handle page.mdx files (convert to directory index)
  urlPath = urlPath.replace(/\/page$/, '');
  
  // Handle root page
  if (urlPath === 'page' || urlPath === '') {
    return '/';
  }
  
  // Ensure leading slash
  if (!urlPath.startsWith('/')) {
    urlPath = '/' + urlPath;
  }
  
  return urlPath;
}

export async function GET() {
  try {
    const appDir = join(process.cwd(), 'app');
    const mdxFiles = await getMDXFiles(appDir);
    
    const pages: Array<{
      url: string;
      lastmod: string;
      changefreq: string;
      priority: string;
    }> = [];
    const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    for (const file of mdxFiles) {
      try {
        const content = await readFile(file.path, 'utf-8');
        const frontmatter = extractFrontmatter(content);
        
        // Convert file path to URL path
        const relativePath = file.relativePath.replace('app/', '');
        const urlPath = filePathToUrlPath(relativePath);
        
        // Determine page priority and change frequency
        let priority = '0.5';
        let changefreq = 'weekly';
        
        if (urlPath === '/') {
          priority = '1.0';
          changefreq = 'daily';
        } else if (urlPath.startsWith('/posts/') && urlPath !== '/posts') {
          priority = '0.8';
          changefreq = 'monthly';
        } else if (urlPath === '/posts' || urlPath === '/about') {
          priority = '0.7';
          changefreq = 'weekly';
        }
        
        // Use frontmatter date if available, otherwise use current date
        let lastmod = now;
        if (frontmatter.date) {
          try {
            const date = new Date(frontmatter.date.replace(/\//g, '-'));
            if (!isNaN(date.getTime())) {
              lastmod = date.toISOString().split('T')[0];
            }
          } catch (e) {
            console.warn(`Warning: Invalid date format in ${file.relativePath}:`, frontmatter.date);
          }
        }
        
        pages.push({
          url: urlPath,
          lastmod,
          changefreq,
          priority
        });
        
      } catch (error) {
        console.warn(`Warning: Could not process ${file.relativePath}:`, error);
      }
    }
    
    // Sort pages by URL for consistency
    pages.sort((a, b) => a.url.localeCompare(b.url));
    
    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}