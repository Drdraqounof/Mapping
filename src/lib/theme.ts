import type { RouteType } from '@/lib/types'

export const ROUTE_COLOR: Record<RouteType, string> = {
  truck: '#f97316',
  bike: '#22c55e',
}

export const KPI_COLOR = {
  time: '#3b82f6',
  fuel: '#f97316',
  co2: '#22c55e',
}

export const KPI_MAX = {
  time: 120, // minutes
  fuel: 80,  // USD
  co2: 50,   // kg
}

// Used to derive fuel cost + emissions from real routed distance.
export const TRUCK_MPG = 14 // typical delivery van, miles per gallon
export const TRUCK_CO2_PER_KM = 0.77 // kg CO2/km (typical delivery van)
export const KM_TO_MILES = 0.621371

// Used only if the live EIA gas price API is unreachable or unconfigured.
export const FALLBACK_GAS_PRICE_PER_GALLON = 3.5

export function truckFuelCost(distanceKm: number, pricePerGallon: number): number {
  const gallonsUsed = (distanceKm * KM_TO_MILES) / TRUCK_MPG
  return gallonsUsed * pricePerGallon
}

// How much longer/costlier an unoptimized (naive, un-sequenced) version of the
// same stop list would be — used only to compute the "vs. unoptimized" savings
// shown in the UI. Real optimization would come from a routing/VRP solver;
// this constant keeps the comparison consistent instead of random numbers.
const INEFFICIENCY_FACTOR: Record<RouteType, number> = {
  truck: 0.35,
  bike: 0.3,
}

export function inefficiencyFactor(type: RouteType): number {
  return INEFFICIENCY_FACTOR[type]
}
