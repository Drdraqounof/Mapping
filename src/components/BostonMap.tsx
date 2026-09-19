'use client'

import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import { NODES, BOSTON_CENTER } from '@/data/nodes'
import { ROUTE_COLOR } from '@/lib/theme'
import type { Route } from '@/lib/types'

function nodeIcon(type: keyof typeof NODE_COLOR, isSelected: boolean, isHovered: boolean) {
  const color = NODE_COLOR[type]
  const size = type === 'depot' ? 16 : type === 'hub' ? 14 : isSelected ? 12 : 10
  const ring = isHovered ? '2px solid #e2e8f0' : '1px solid #0a0c0f'
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:${ring};box-shadow:0 0 6px ${color}66;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

const NODE_COLOR = {
  depot: '#f97316',
  hub: '#3b82f6',
  stop: '#2d3748',
}

function FitBounds({ nodeIds, selectedRoute }: { nodeIds: string[]; selectedRoute?: Route }) {
  const map = useMap()

  useEffect(() => {
    const keyPoints: [number, number][] = selectedRoute?.geometry?.length
      ? selectedRoute.geometry
      : nodeIds.filter(id => NODES[id]).map(id => [NODES[id].lat, NODES[id].lng] as [number, number])

    if (!keyPoints.length) return

    const bounds = L.latLngBounds(keyPoints)
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [45, 45] })
    }
  }, [map, nodeIds, selectedRoute])

  return null
}

export default function BostonMap({
  routes,
  hovered,
  selected,
  onHover,
  onSelect,
}: {
  routes: Route[]
  hovered: string | null
  selected: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string | null) => void
}) {
  const selectedRoute = routes.find(r => r.id === selected)
  const selectedStops = useMemo(() => new Set(selectedRoute?.stops ?? []), [selectedRoute])

  return (
    <MapContainer
      center={BOSTON_CENTER}
      zoom={13}
      className="w-full h-full"
      style={{ background: '#0a0c0f' }}
    >
      <TileLayer
        className="map-tiles-dark"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds nodeIds={Object.keys(NODES)} selectedRoute={selectedRoute} />

      {routes.map(route => {
        const isSelected = route.id === selected
        const color = ROUTE_COLOR[route.type]
        return (
          <Polyline
            key={route.id}
            positions={route.geometry}
            pathOptions={{
              color,
              weight: isSelected ? 4 : 2,
              opacity: isSelected ? 0.95 : 0.35,
              dashArray: route.type === 'bike' ? '6 6' : undefined,
            }}
            eventHandlers={{ click: () => onSelect(route.id) }}
          />
        )
      })}

      {Object.entries(NODES).map(([id, node]) => {
        const isInRoute = selectedStops.has(id)
        return (
          <Marker
            key={id}
            position={[node.lat, node.lng]}
            icon={nodeIcon(node.type, isInRoute, hovered === id)}
            eventHandlers={{
              mouseover: () => onHover(id),
              mouseout: () => onHover(null),
            }}
          >
            <Tooltip direction="right" offset={[10, 0]}>
              <div className="text-xs">
                <p className="font-semibold">{node.label}</p>
                <p className="font-mono text-[#64748b]">{node.type.toUpperCase()}</p>
              </div>
            </Tooltip>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
