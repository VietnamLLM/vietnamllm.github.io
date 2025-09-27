import type { MetadataRoute } from 'next'
import { readdirSync, statSync } from 'fs'
import path from 'path'

export const dynamic = "force-static"

// Base URL for the site
const BASE_URL = process.env.SITE_URL || 'https://vietnamllm.github.io'

// Function to get file modification time
function getFileModTime(filePath: string): Date {
    try {
        return statSync(filePath).mtime
    } catch {
        return new Date()
    }
}

// Function to recursively find files
function findFiles(dir: string, extension: RegExp, basePath: string = ''): string[] {
    const files: string[] = []
    
    try {
        const items = readdirSync(path.join(process.cwd(), dir), { withFileTypes: true })
        
        for (const item of items) {
            const fullPath = path.join(dir, item.name)
            const relativePath = basePath ? path.join(basePath, item.name) : item.name
            
            if (item.isDirectory()) {
                // Recursively search subdirectories
                files.push(...findFiles(fullPath, extension, relativePath))
            } else if (item.isFile() && extension.test(item.name)) {
                files.push(relativePath)
            }
        }
    } catch (error) {
        console.warn(`Could not read directory ${dir}:`, error)
    }
    
    return files
}

// Function to convert file path to URL path
function filePathToUrl(filePath: string): string {
    // Remove file extensions and handle page files
    let urlPath = filePath
        .replace(/\/page\.(mdx|tsx)$/, '')
        .replace(/\.(mdx|tsx)$/, '')
    
    // Handle root page
    if (urlPath === 'page' || urlPath === '') {
        return ''
    }
    
    return urlPath
}

// Function to determine priority based on path
function getPriority(urlPath: string): number {
    if (urlPath === '') return 1.0 // Homepage
    if (urlPath === 'about') return 0.8
    if (urlPath === 'posts') return 0.7
    if (urlPath.startsWith('posts/')) return 0.6 // Individual posts
    return 0.5
}

// Function to determine change frequency
function getChangeFrequency(urlPath: string): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
    if (urlPath === '') return 'monthly' // Homepage
    if (urlPath === 'about') return 'yearly'
    if (urlPath === 'posts') return 'weekly'
    if (urlPath.startsWith('posts/')) return 'monthly' // Individual posts
    return 'monthly'
}

export default function sitemap(): MetadataRoute.Sitemap {
    try {
        // Find all page files and MDX files in the app directory
        const appFiles = findFiles('app', /\.(mdx|tsx)$/)
        
        // Filter to get relevant files
        const relevantFiles = appFiles.filter(file => {
            // Include page files
            if (file.endsWith('/page.mdx') || file.endsWith('/page.tsx')) {
                return true
            }
            // Include individual post files (but not the posts/page.mdx)
            if (file.startsWith('posts/') && file.endsWith('.mdx') && !file.endsWith('/page.mdx')) {
                return true
            }
            // Include root page.mdx
            if (file === 'page.mdx') {
                return true
            }
            return false
        })
        
        const sitemapEntries: MetadataRoute.Sitemap = relevantFiles.map(filePath => {
            const urlPath = filePathToUrl(filePath)
            const fullPath = path.join(process.cwd(), 'app', filePath)
            const lastModified = getFileModTime(fullPath)
            
            return {
                url: `${BASE_URL}${urlPath ? `/${urlPath}` : ''}`,
                lastModified,
                changeFrequency: getChangeFrequency(urlPath),
                priority: getPriority(urlPath),
            }
        })
        
        // Sort by priority (highest first)
        return sitemapEntries.sort((a, b) => (b.priority || 0) - (a.priority || 0))
        
    } catch (error) {
        console.error('Error generating sitemap:', error)
        // Fallback to static entries if dynamic generation fails
        return [
            {
                url: `${BASE_URL}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 1,
            },
            {
                url: `${BASE_URL}/about`,
                lastModified: new Date(),
                changeFrequency: 'yearly',
                priority: 0.8,
            },
            {
                url: `${BASE_URL}/posts`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            },
        ]
    }
}