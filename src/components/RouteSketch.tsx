import { NODES } from '../data/nodes'
import { ROUTE_DEFINITIONS } from '../data/routes'
import { ROUTE_COLOR } from '../lib/theme'

const W = 480
const H = 400
const PAD = 36

// Equirectangular projection of the real stop coordinates into the SVG box.
const points = Object.values(NODES)
const lats = points.map(n => n.lat)
const lngs = points.map(n => n.lng)
const [minLat, maxLat, minLng, maxLng] = [Math.min(...lats), Math.max(...lats), Math.min(...lngs), Math.max(...lngs)]
const lngScale = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180)
const scale = Math.min((W - PAD * 2) / ((maxLng - minLng) * lngScale), (H - PAD * 2) / (maxLat - minLat))
const offsetX = (W - (maxLng - minLng) * lngScale * scale) / 2
const offsetY = (H - (maxLat - minLat) * scale) / 2

function project(lat: number, lng: number): [number, number] {
  return [offsetX + (lng - minLng) * lngScale * scale, offsetY + (maxLat - lat) * scale]
}

// Stylised preview of the fleet's route network, drawn from the same data the dashboard uses.
export default function RouteSketch({ className }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label="Sketch of the Boston truck and bike route network">
      <defs>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="#1f2530" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#grid)" />

      {ROUTE_DEFINITIONS.map(route => {
        const d = route.stops
          .filter(s => NODES[s])
          .map((s, j) => {
            const [x, y] = project(NODES[s].lat, NODES[s].lng)
            return `${j === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
          })
          .join(' ')
        return (
          <path
            key={route.id}
            d={d}
            fill="none"
            stroke={ROUTE_COLOR[route.type]}
            strokeWidth={route.type === 'truck' ? 2.5 : 2}
            strokeOpacity={route.active ? 0.85 : 0.3}
            strokeDasharray={route.type === 'bike' ? '6 6' : undefined}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )
      })}

      {Object.entries(NODES).map(([id, node]) => {
        const [x, y] = project(node.lat, node.lng)
        const isDepot = node.type !== 'stop'
        return (
          <g key={id}>
            <circle
              cx={x}
              cy={y}
              r={isDepot ? 6 : 4}
              fill={node.type === 'depot' ? '#f97316' : node.type === 'hub' ? '#3b82f6' : '#0a0c0f'}
              stroke={isDepot ? '#0a0c0f' : '#64748b'}
              strokeWidth={1.5}
            />
            {isDepot && (
              <text x={x + 10} y={y + 4} fontSize="11" fill="#94a3b8" fontFamily="ui-monospace, monospace">
                {node.label}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
