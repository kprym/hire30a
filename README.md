# Hire30A Coming-Soon Experience

Hire30A is a search-optimized, mobile-ready preview site for hospitality hiring along Florida's Scenic 30A corridor. The project now spans a full multi-page experience with live aggregation, profile builders, and a secure admin portal so the team can demonstrate the upcoming marketplace without requiring logins.

## Features

- **SEO-first landing page** with structured data, canonical tags, and open graph metadata that highlight the 30A, Destin, and Panama City Beach markets.
- **Live jobs feed** (`jobs.html`) that filters by keyword, neighborhood, category, source, and posted date. Results sync from LinkedIn, Indeed, SoWal forums, and optional proxies using the built-in aggregator.
- **Talent studio & employer spotlight** (`talent.html` and `employers.html`) where locals and hiring managers craft shareable profiles, export JSON, and copy summaries without creating accounts.
- **Passcode-gated admin portal** (`admin.html`) to control colors, hero copy, aggregation credentials, job refreshes, profile moderation, and passcode rotation. Changes persist via `localStorage` and broadcast across open tabs.
- **Roadmap storytelling & newsletter capture** on `index.html` to nurture the community while paid offerings are still in development.

## Structure

```
.
├── index.html            # Public landing page & roadmap
├── jobs.html             # Live job aggregation view with filters
├── talent.html           # Job seeker profile builder
├── employers.html        # Employer spotlight builder
├── admin.html            # Admin controls for branding, data, and gating
├── assets
│   ├── css
│   │   └── main.css      # Global styling, responsive layout, admin gate styles
│   ├── js
│   │   ├── data.js       # Shared storage helpers, aggregation, security utilities
│   │   ├── main.js       # Landing page interactivity & metrics
│   │   ├── jobs.js       # Jobs feed rendering, filtering, and refresh logic
│   │   ├── profiles.js   # Talent/employer profile builders & exports
│   │   └── admin.js      # Admin portal gating, configuration, and exports
│   └── images            # Brand illustrations, logos, map, and favicons
├── robots.txt            # Crawl directives pointing to sitemap
├── sitemap.xml           # Discoverable URLs for search engines
└── site.webmanifest      # Progressive web app metadata
```

## Local Preview

Open any HTML file directly in your browser or serve the directory with a static server (for example, `python -m http.server`). Data persists in the browser’s `localStorage`, so each browser/device maintains its own sandboxed content.

## Configuring the Aggregator

1. Unlock `admin.html` using the default passcode **GulfAccess2024!** (change it immediately under *Security & access*).
2. In the **Job aggregation settings** section, provide your RapidAPI JSearch key (for LinkedIn/Indeed/ZipRecruiter results) and optional SoWal RSS URL or proxy endpoint.
3. Toggle which sources to include and save. A test button triggers a fetch and stores the results locally; the jobs page reflects changes instantly.
4. Use the **Refresh jobs now** button anytime to rehydrate the feed. Export JSON snapshots for analytics or archive purposes.

## Building Community Profiles

- Talent and employers can create profiles on their dedicated pages, mark them as “Publish,” and export JSON or copy formatted summaries. Published counts feed the homepage and admin metrics.
- The admin portal lists all stored profiles so moderators can export or clear them before the full platform launches.

## Security Notes

- The admin portal is gated by a SHA-256 hashed passcode stored in `localStorage`. Rotate it frequently using the form in the *Security & access* section.
- API keys stay in the browser; consider proxying through your own backend when deploying beyond the coming-soon phase.

## Roadmap Highlights

This coming-soon build prepares the foundation for authenticated employer/candidate accounts, ATS integrations, analytics dashboards, paid placements, and automated distribution of hospitality opportunities throughout the Emerald Coast.
