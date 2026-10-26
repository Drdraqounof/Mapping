'use client'

import { Fragment, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, ZoomControl, useMap } from 'react-leaflet'
import L from 'leaflet'
import { NODES, BOSTON_CENTER } from '../data/nodes'
import { MAP_ROUTE_COLOR } from '../lib/theme'
import type { NodeType, Route } from '../lib/types'

const NODE_COLOR: Record<NodeType, string> = {
  depot: '#e8710a',
  hub: '#1a73e8',
  stop: '#ffffff',
}

function nodeIcon(type: NodeType, inSelectedRoute: boolean, isHovered: boolean) {
  const isStop = type === 'stop'
  const size = isStop ? (inSelectedRoute || isHovered ? 14 : 11) : 18
  const border = isStop ? `2px solid ${inSelectedRoute ? '#202124' : '#5f6368'}` : '3px solid #ffffff'
  const shadow = isHovered ? '0 0 0 4px rgba(26,115,232,0.25), 0 1px 4px rgba(0,0,0,0.4)' : '0 1px 4px rgba(0,0,0,0.35)'
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${NODE_COLOR[type]};border:${border};box-shadow:${shadow};box-sizing:border-box"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

// Keep the fitted area clear of the panel: side panel on desktop (when open), bottom sheet on phones.
function fitPadding(panelOpen: boolean): L.FitBoundsOptions {
  if (typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches) {
    return { paddingTopLeft: [panelOpen ? 448 : 60, 80], paddingBottomRight: [60, 60] }
  }
  const sheet = typeof window !== 'undefined' ? window.innerHeight * 0.45 : 300
  return { paddingTopLeft: [24, 80], paddingBottomRight: [24, sheet + 16] }
}

function FitBounds({ selectedRoute, panelOpen }: { selectedRoute?: Route; panelOpen: boolean }) {
  const map = useMap()

  useEffect(() => {
    const points: [number, number][] = selectedRoute?.geometry?.length
      ? selectedRoute.geometry
      : Object.values(NODES).map(n => [n.lat, n.lng] as [number, number])
    const bounds = L.latLngBounds(points)
    if (bounds.isValid()) map.fitBounds(bounds, fitPadding(panelOpen))
  }, [map, selectedRoute, panelOpen])

  return null
}

export default function BostonMap({
  routes,
  hoveredNode,
  hoveredRoute,
  selected,
  panelOpen,
  onHoverNode,
  onSelect,
}: {
  routes: Route[]
  hoveredNode: string | null
  hoveredRoute: string | null
  selected: string | null
  panelOpen: boolean
  onHoverNode: (id: string | null) => void
  onSelect: (id: string) => void
}) {
  const selectedRoute = routes.find(r => r.id === selected)
  const selectedStops = useMemo(() => new Set(selectedRoute?.stops ?? []), [selectedRoute])
  const focusId = hoveredRoute ?? selected

  // Draw the focused route last so it sits on top.
  const ordered = [...routes].sort((a, b) => Number(a.id === focusId) - Number(b.id === focusId))

  return (
    <MapContainer center={BOSTON_CENTER} zoom={12} zoomControl={false} className="w-full h-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      <FitBounds selectedRoute={selectedRoute} panelOpen={panelOpen} />

      {ordered.map(route => {
        const isFocused = route.id === focusId
        const dimmed = focusId !== null && !isFocused
        const color = MAP_ROUTE_COLOR[route.type]
        const click = { click: () => onSelect(route.id) }
        return (
          <Fragment key={route.id}>
            {/* Outline underneath, like a casing on a road map */}
            <Polyline
              positions={route.geometry}
              pathOptions={{ color: '#ffffff', weight: isFocused ? 10 : 7, opacity: dimmed ? 0.4 : 0.95 }}
              eventHandlers={click}
            />
            <Polyline
              positions={route.geometry}
              pathOptions={{
                color,
                weight: isFocused ? 6 : 4,
                opacity: dimmed ? 0.35 : 1,
                dashArray: route.type === 'bike' ? '1 9' : undefined,
                lineCap: 'round',
              }}
              eventHandlers={click}
            />
          </Fragment>
        )
      })}

      {Object.entries(NODES).map(([id, node]) => (
        <Marker
          key={id}
          position={[node.lat, node.lng]}
          icon={nodeIcon(node.type, selectedStops.has(id), hoveredNode === id)}
          zIndexOffset={node.type === 'stop' ? 0 : 500}
          eventHandlers={{ mouseover: () => onHoverNode(id), mouseout: () => onHoverNode(null) }}
        >
          <Tooltip direction="top" offset={[0, -10]}>
            <span className="block text-[13px] font-medium text-[#202124]">{node.label}</span>
            <span className="block text-[12px] capitalize text-[#5f6368]">{node.type}</span>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  )
}
