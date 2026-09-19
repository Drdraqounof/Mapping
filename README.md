# Mapping — Boston Fleet Optimizer

A fleet route dashboard for Boston delivery/bike routes: a real Leaflet map with
street-following route geometry, live fuel pricing, and per-route savings vs.
an unoptimized baseline.

## Features

- Real map of Boston (OpenStreetMap tiles, dark-themed) via `react-leaflet`
- Truck and bike routes rendered as real street-following paths, fetched from
  the OSRM public routing API (falls back to straight-line estimates if
  unreachable)
- Live regional gas prices from the [EIA Open Data API](https://www.eia.gov/opendata/),
  used to compute real fuel costs instead of a fixed rate
- Route list with filtering, active/inactive toggles, and a detail panel
  showing distance, duration, fuel cost, CO₂ output, and stop sequence

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` starts the Next.js dev server and opens your browser to
`http://localhost:3000` automatically.

## Environment variables

Copy `.env` and set:

```
EIA_API_KEY=your_key_here
```

Get a free key at https://www.eia.gov/opendata/register.php. Without a key,
gas prices fall back to a static estimate ($3.50/gal) instead of live data.

## Project structure

- `src/app/` — Next.js App Router pages (`/` and `/map` both render the dashboard)
- `src/app/api/gas-price/` — server route that fetches the live EIA gas price
- `src/components/` — dashboard UI (map, sidebar, route detail panel, KPIs)
- `src/data/` — Boston neighborhood coordinates and route definitions
- `src/lib/` — types, theme/constants, OSRM routing helper, and the
  `useRoutes` hook that ties routing + gas price + savings together

## Scripts

- `npm run dev` — start the dev server (opens the browser automatically)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint the project
