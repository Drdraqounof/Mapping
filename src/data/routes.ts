import type { RouteDefinition } from '../lib/types'

export const ROUTE_DEFINITIONS: RouteDefinition[] = [
  {
    id: 'r1',
    name: 'Downtown Loop — Optimized',
    type: 'truck',
    stops: ['plant', 'back_bay', 'downtown', 'north_end', 'waterfront', 'depot_east', 'south_boston', 'plant'],
    active: true,
  },
  {
    id: 'r2',
    name: 'Cambridge — Charlestown Run',
    type: 'truck',
    stops: ['plant', 'charlestown', 'cambridge', 'allston', 'fenway', 'back_bay', 'depot_east', 'plant'],
    active: true,
  },
  {
    id: 'r3',
    name: 'South Shore Express',
    type: 'truck',
    stops: ['plant', 'roxbury', 'jamaica_plain', 'dorchester', 'south_boston', 'plant'],
    active: false,
  },
  {
    id: 'r4',
    name: 'Inner City Bike Circuit',
    type: 'bike',
    stops: ['plant', 'back_bay', 'fenway', 'allston', 'back_bay', 'downtown', 'plant'],
    active: true,
  },
  {
    id: 'r5',
    name: 'Waterfront — North End Bike',
    type: 'bike',
    stops: ['plant', 'east_boston', 'waterfront', 'downtown', 'north_end', 'charlestown', 'plant'],
    active: true,
  },
]
