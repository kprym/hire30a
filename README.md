# Hire30A Coming-Soon Experience

Hire30A is a search-friendly, mobile-first preview site for locals hiring locals across Santa Rosa Beach, Destin, and Panama City Beach, Florida. The experience focuses on storytelling, collecting real interest, and giving the community a place to share jobs and resumes while the full marketplace is in development.

## Highlights

- **SEO-ready landing page** with structured data, open graph tags, roadmap storytelling, and newsletter capture designed to rank for Gulf Coast hospitality searches.
- **Job board preview** (`jobs.html`) that blends clearly labelled sample listings with real community submissions, complete with filters and a self-serve "Share an opening" form.
- **Talent studio & employer spotlight** (`talent.html` and `employers.html`) where locals and hiring teams can publish profiles without logins. Submissions update counts across the site instantly.
- **Lightweight admin portal** (`admin.html`) gated by a passcode so the team can adjust brand colors, hero messaging, export JSON snapshots, and clear local submissions. Everything persists in browser `localStorage`.
- **Consistent branding system** managed through CSS variables so the look and feel stays cohesive across all pages and viewports.

## Project Structure

```
.
├── index.html            # Public landing page and roadmap
├── jobs.html             # Job board preview with filters and submission form
├── talent.html           # Talent profile form and showcase
├── employers.html        # Employer spotlight form and showcase
├── admin.html            # Passcode-gated admin controls
├── assets
│   ├── css
│   │   └── main.css      # Global styles and responsive layout
│   ├── js
│   │   ├── data.js       # Shared localStorage helpers and sample content
│   │   ├── main.js       # Landing page interactivity, metrics, and nav
│   │   ├── jobs.js       # Job filtering, rendering, and submission logic
│   │   ├── profiles.js   # Talent/employer form handling and rendering
│   │   └── admin.js      # Admin gating, branding, and export utilities
│   └── images            # Logos and supporting artwork
├── robots.txt            # Crawl directives
├── sitemap.xml           # Page index for search engines
└── site.webmanifest      # Basic PWA metadata
```

## Running Locally

No build step is required. Open `index.html` (or any page) directly in a browser, or serve the directory with a static server such as:

```
python -m http.server
```

All data is stored in the browser's `localStorage`, so each browser/device maintains its own sandboxed submissions. Clearing browser storage resets the experience to the default sample content.

## Admin Portal

1. Visit `admin.html` and enter the default preview passcode **emeraldcoast**.
2. Adjust primary/accent brand colors or update the hero heading/subheading, then save to apply changes immediately across the site.
3. Export submissions as JSON using the provided buttons. Downloads reflect only the data stored on the current device.
4. Use the clear buttons to remove local submissions before a demo or fresh import. This does not affect other browsers.

## Community Submissions

- **Jobs:** The jobs page stores submissions with metadata provided via the form. They appear instantly with a "Community submission" badge and feed the homepage metrics.
- **Talent & Employers:** Profile forms capture highlights, availability, and contact info. Entries are saved locally and surfaced on their respective showcase pages.
- **Newsletter:** Newsletter signups are counted and can be exported from the admin area for follow-up campaigns.

The site intentionally avoids fabricated metrics—counts only reflect the submissions stored in the current browser plus clearly labelled sample previews. Paid options and automated sourcing will be layered in once the full Hire30A platform launches.
=======
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
