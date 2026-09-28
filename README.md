# Mapping — Boston Fleet Optimizer

A fleet route dashboard for Boston delivery and bike operations, with a branded login screen and a live operational dashboard for route monitoring, cost analysis, and dispatch planning.

## Features

- Public homepage describing the product, with a route-network sketch drawn from the real route data
- Sign-in with a signed, httpOnly session cookie; the dashboard is only reachable when signed in
- Real map of Boston (OpenStreetMap tiles, dark-themed) via `react-leaflet`
- Truck and bike routes rendered as real street-following paths, fetched from the OSRM public routing API (with a fallback estimate if unreachable)
- Live regional gas prices from the [EIA Open Data API](https://www.eia.gov/opendata/), used to compute real fuel costs instead of a fixed rate
- Route list with filtering, active/inactive toggles, and a detail panel showing distance, duration, fuel cost, CO₂ output, and stop sequence

## App flow

- `/` — public homepage
- `/login` — sign-in page (redirects to `/dashboard` if already signed in)
- `/dashboard` — fleet operations dashboard (requires sign-in)
- `/map` — same dashboard view (requires sign-in)

Protected pages are checked twice: `src/proxy.ts` redirects signed-out visitors to `/login`, and each page re-verifies the session on the server.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router, Turbopack) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v4 for styling
- [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/) for the map
- [OSRM](https://project-osrm.org/) public routing API for street-following route geometry
- [EIA Open Data API](https://www.eia.gov/opendata/) for live regional gas prices
- [OpenStreetMap](https://www.openstreetmap.org/) tiles (dark theme via CSS filter)

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` starts the Next.js dev server and opens your browser to `http://localhost:3000` automatically.

## Environment variables

Set these in `.env`:

```bash
EIA_API_KEY=your_key_here

# Sign-in (single operator account)
AUTH_EMAIL=you@company.com
AUTH_PASSWORD=choose-a-strong-password
SESSION_SECRET=output-of-openssl-rand-base64-32
```

- `EIA_API_KEY` — get a free key at https://www.eia.gov/opendata/register.php. Without a key, gas prices fall back to a static estimate ($3.50/gal) instead of live data.
- `AUTH_EMAIL` / `AUTH_PASSWORD` — the account that can sign in. In development, if unset, the demo account `ops@routes.io` / `password123` is used and shown on the login page. In production, sign-in is disabled until they're set.
- `SESSION_SECRET` — signs session cookies. Required in production; development uses an insecure built-in default.

## Project structure

- `src/app/` — App Router pages (homepage, login, dashboard, map) and `actions/auth.ts` (sign-in/sign-out server actions)
- `src/proxy.ts` — redirects signed-out visitors away from protected pages
- `src/app/api/gas-price/` — server route that fetches the live EIA gas price
- `src/components/` — dashboard UI (map, sidebar, route detail panel, KPIs)
- `src/data/` — Boston neighborhood coordinates and route definitions
- `src/lib/` — session signing (`session.ts`), auth helpers (`auth.ts`), types, theme/constants, OSRM routing helper, and the `useRoutes` hook that ties routing + gas price + savings together

## Scripts

- `npm run dev` — start the dev server (opens the browser automatically)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint the project
