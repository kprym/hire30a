# Hire30A Coming-Soon Experience

Hire30A is a search-optimized, mobile-ready landing experience for hospitality hiring along Florida's Scenic 30A corridor. The project highlights jobs, resumes, neighborhood insights, and an admin preview that simulates future platform controls.

## Features

- **SEO-first landing page** with structured data, canonical tags, open graph metadata, and a sitemap/robots combo.
- **Dynamic job board** featuring location, category, and schedule filters that cover Santa Rosa Beach, Destin, Panama City Beach, and surrounding districts.
- **Resume spotlight grid** showcasing local talent, with submission forms that persist to `localStorage` for instant previews.
- **Admin portal prototype** to manage brand colors, hero messaging, and community submissions while syncing updates across tabs.
- **Coming-soon storytelling** including roadmap, micro-market highlights, newsletter capture, and animated hiring pulse ticker.

## Structure

```
.
├── index.html            # Public landing page with jobs, resumes, and newsletter capture
├── admin.html            # Admin preview for branding, content, and submission management
├── assets
│   ├── css
│   │   └── main.css      # Global styling and responsive layout
│   ├── js
│   │   ├── main.js       # Landing page interactivity and filter logic
│   │   └── admin.js      # Admin portal controls and data exports
│   └── images            # Brand illustrations, logos, and favicons
├── robots.txt            # Crawl directives pointing to sitemap
├── sitemap.xml           # Discoverable URLs for search engines
└── site.webmanifest      # Progressive web app metadata for mobile devices
```

## Local Preview

Open `index.html` or `admin.html` directly in your browser or serve the directory using any static server (for example, `python -m http.server`). Job and resume submissions are stored in `localStorage`, so data will persist per browser.

## Customization

1. Visit `admin.html` to adjust brand colors, hero copy, and review submissions.
2. Submit jobs or resumes from the public landing page.
3. Refresh the public site to view synchronized updates via browser storage events.

## Roadmap Highlights

This coming-soon build is the foundation for deeper functionality such as authenticated employer/candidate accounts, ATS integrations, analytics dashboards, and automated distribution of hospitality opportunities throughout the Emerald Coast.
