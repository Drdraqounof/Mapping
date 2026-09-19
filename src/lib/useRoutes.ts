import { useEffect, useState } from 'react'
import { NODES } from '@/data/nodes'
import { ROUTE_DEFINITIONS } from '@/data/routes'
import { fetchRouteGeometry } from '@/lib/osrm'
import { TRUCK_CO2_PER_KM, truckFuelCost, inefficiencyFactor, FALLBACK_GAS_PRICE_PER_GALLON } from '@/lib/theme'
import type { GasPriceResponse } from '@/app/api/gas-price/route'
import type { Route } from '@/lib/types'

function toCoords(stops: string[]): [number, number][] {
  return stops.filter(s => NODES[s]).map(s => [NODES[s].lat, NODES[s].lng])
}

async function loadGasPrice(): Promise<GasPriceResponse> {
  try {
    const res = await fetch('/api/gas-price')
    if (!res.ok) throw new Error(`gas-price ${res.status}`)
    return await res.json()
  } catch {
    return { pricePerGallon: FALLBACK_GAS_PRICE_PER_GALLON, period: null, isFallback: true }
  }
}

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[] | null>(null)
  const [gasPrice, setGasPrice] = useState<GasPriceResponse | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const price = await loadGasPrice()
      if (cancelled) return
      setGasPrice(price)

      const withMetrics = await Promise.all(
        ROUTE_DEFINITIONS.map(async def => {
          const coords = toCoords(def.stops)
          const result = await fetchRouteGeometry(def.type, coords)
          const factor = inefficiencyFactor(def.type)

          const fuelCost = def.type === 'truck' ? truckFuelCost(result.distanceKm, price.pricePerGallon) : 0
          const co2 = def.type === 'truck' ? result.distanceKm * TRUCK_CO2_PER_KM : 0

          const route: Route = {
            ...def,
            distance: result.distanceKm,
            duration: result.durationMin,
            fuelCost,
            co2,
            geometry: result.geometry,
            isFallbackGeometry: result.isFallback,
            savings: {
              time: result.durationMin * factor,
              fuel: fuelCost * factor,
              co2: co2 * factor,
            },
          }
          return route
        }),
      )
      if (!cancelled) setRoutes(withMetrics)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  function toggleRoute(id: string) {
    setRoutes(rs => rs?.map(r => (r.id === id ? { ...r, active: !r.active } : r)) ?? rs)
  }

  return { routes, toggleRoute, gasPrice }
}
