# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 blog application that uses Notion as a headless CMS. The architecture leverages:
- Material UI (MUI) for styling with custom theme configuration
- TypeScript with strict type checking enabled
- Server-side rendering with React Server Components
- Built-in caching for Notion API calls using React.cache()

## Essential Commands

```bash
# Development server (runs on port 9158, not default 3000)
yarn dev

# Build for production
yarn build

# Run production server
yarn start

# Lint check
yarn lint

# Docker deployment
docker build -t notion-blog .
docker run -p 3000:3000 notion-blog
```

## Environment Configuration

Create a `.env.local` file with these required variables:
- `NOTION_TOKEN`: Your Notion integration token for API access
- `DATABASE_ID`: The Notion database ID containing blog posts

## Architecture Deep Dive

### Notion Integration Pattern

The Notion integration is centralized in `src/service/notion.ts` with the following key features:
- All API calls are wrapped with React.cache() for automatic request deduplication
- Recursive block fetching with configurable depth limit (default max: 3 levels) to prevent performance issues
- Console logging for fetch timing analysis

Blog posts require these Notion database properties:
- `Name` (title field)
- `slug` (rich_text - used for URL paths)
- `summary` (rich_text - post excerpt)
- `tags` (multi_select with color)
- `is_published` (checkbox - controls visibility)
- `create_date` (date field)

### Rendering Pipeline

The block rendering system (`src/app/utils/renderer.tsx`) converts Notion blocks to React components:

**Supported block types:**
- Text blocks: paragraph, heading_1, heading_2, heading_3
- Lists: bulleted_list_item, numbered_list_item (with nesting)
- Interactive: toggle (collapsible content)
- Formatting: quote, divider
- Code: syntax-highlighted code blocks using Bright library
- Media: images with captions
- Tables: with header row support

**Rich text features:**
- Annotations: bold, italic, strikethrough, underline, inline code
- Links with external target
- Color styling
- Nested formatting combinations

### Key Implementation Details

1. **Pagination System**: 
   - Blog list uses cursor-based pagination
   - Default: 2 posts per page (configurable in `src/app/blogs/page.tsx:14`)
   - Client-side navigation component

2. **Static Generation**:
   - Uses `generateStaticParams` for pre-rendering blog posts
   - First batch generated at build time
   - Additional posts rendered on-demand with caching

3. **Comment System**:
   - Client-side form posts to `/api/comments`
   - Creates comments directly in Notion
   - No local storage or database

4. **Outline Generation**:
   - Automatically extracts h2/h3 headings from content
   - Creates table of contents for blog posts
   - Client-side toggle component

5. **Layout Constraints**:
   - Fixed 1080px width container
   - Not responsive by default
   - Centered layout with fixed margins

## Common Development Tasks

### Adding New Block Types

1. Define the type interface in `src/service/type.ts`
2. Add rendering logic in `src/app/utils/renderer.tsx`
3. Update the renderBlock switch statement
4. Handle any recursive/nested content if applicable

### Modifying Blog Configuration

**Change posts per page:**
- Edit `page_size` in `src/app/blogs/page.tsx:14`
- Update corresponding value in `src/app/blogs/[slug]/page.tsx:18`

**Adjust recursion depth for nested blocks:**
- Modify `maxDepth` parameter in `getBlocks()` calls
- Default locations: `src/service/notion.ts:13`

### Debugging Notion Integration

- Console logs show fetch timing for each depth level
- Check environment variables are properly set
- Test Notion API directly using service functions
- Verify database schema matches expected properties

## Performance Considerations

- **Caching Strategy**: All Notion API calls cached via React.cache() until next build
- **Depth Limiting**: Block fetching limited to prevent infinite recursion
- **Static Optimization**: Initial posts statically generated, others SSR with cache
- **Image Handling**: Images served from Notion CDN with expiry timestamps

## Known Limitations & Potential Improvements

**Current Limitations:**
- `getPlainTextFromRichText` utility only returns first text item (may truncate rich text)
- Fixed 1080px layout width (not responsive)
- No dark mode implementation despite theme setup
- Comment submission lacks user feedback for errors
- No search functionality
- No RSS/Atom feed generation
- No sitemap generation

**Areas for Enhancement:**
- Implement responsive design
- Add dark mode toggle using MUI theme
- Enhance error handling with user notifications
- Add search with Notion API filtering
- Implement RSS feed generation
- Add meta tags for better SEO
- Create sitemap for search engines