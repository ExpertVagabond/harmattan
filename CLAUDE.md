# Harmattan

Air quality monitoring platform for Ghana — Tech Hub Africa Hackathon 2026 submission.

## Stack
- Astro 6 + React 19 + Tailwind CSS 4
- Cloudflare Pages + Workers (D1 for community reports)
- Data: OpenAQ API, WAQI API for real-time AQI
- Maps: Leaflet (OSM tiles, no API key needed)

## Commands
```bash
npm run dev      # local dev server
npm run build    # production build
npx wrangler pages deploy dist  # deploy to CF Pages
```

## Structure
- `src/pages/` — Astro pages (index, about, report)
- `src/components/dashboard/` — React dashboard components (map, charts, alerts)
- `src/components/ui/` — shared UI primitives
- `src/lib/` — API clients, data transforms, types
- `src/data/` — static Ghana city/station data
- `src/pages/api/` — Cloudflare Worker endpoints

## Design
- Dark theme with warm amber/orange accents (Harmattan = dusty, warm wind)
- Mobile-first, accessible
- Font: system stack
