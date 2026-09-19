export type NodeType = 'depot' | 'stop' | 'hub'

export interface MapNode {
  lat: number
  lng: number
  label: string
  type: NodeType
}

export type RouteType = 'truck' | 'bike'

export interface RouteSavings {
  time: number
  fuel: number
  co2: number
}

export interface RouteDefinition {
  id: string
  name: string
  type: RouteType
  stops: string[]
  active: boolean
}

export interface RouteMetrics {
  distance: number // km
  duration: number // minutes
  fuelCost: number // USD
  co2: number // kg
  savings: RouteSavings
  geometry: [number, number][] // [lat, lng] pairs, street-following when available
  isFallbackGeometry: boolean
}

export type Route = RouteDefinition & RouteMetrics
