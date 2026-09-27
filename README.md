# Mapping — Boston Fleet Optimizer

A fleet route dashboard for Boston delivery and bike operations, with a branded login screen and a live operational dashboard for route monitoring, cost analysis, and dispatch planning.

## Features

- Dark-themed login landing page for secure fleet access
- Route dashboard flow that redirects from the sign-in screen to the live operations view
- Real map of Boston (OpenStreetMap tiles, dark-themed) via `react-leaflet`
- Truck and bike routes rendered as real street-following paths, fetched from the OSRM public routing API (with a fallback estimate if unreachable)
- Live regional gas prices from the [EIA Open Data API](https://www.eia.gov/opendata/), used to compute real fuel costs instead of a fixed rate
- Route list with filtering, active/inactive toggles, and a detail panel showing distance, duration, fuel cost, CO₂ output, and stop sequence

## App flow

- `/` — landing/login page
- `/dashboard` — fleet operations dashboard
- `/map` — dashboard view with map-focused layout

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

Copy `.env` and set:

```bash
EIA_API_KEY=your_key_here
```

Get a free key at https://www.eia.gov/opendata/register.php. Without a key, gas prices fall back to a static estimate ($3.50/gal) instead of live data.

## Project structure

- `src/app/` — App Router pages, including the landing page, dashboard route, and map route
- `src/app/api/gas-price/` — server route that fetches the live EIA gas price
- `src/components/` — dashboard UI (map, sidebar, route detail panel, KPIs)
- `src/data/` — Boston neighborhood coordinates and route definitions
- `src/lib/` — types, theme/constants, OSRM routing helper, and the `useRoutes` hook that ties routing + gas price + savings together

## Scripts

- `npm run dev` — start the dev server (opens the browser automatically)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint the project
