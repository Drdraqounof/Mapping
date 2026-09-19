import type { MapNode } from '@/lib/types'

// Real Boston-area neighborhood centroids (lat, lng)
export const NODES: Record<string, MapNode> = {
  depot_south:   { lat: 42.3388, lng: -71.0784, label: 'South End Depot',   type: 'depot' },
  depot_east:    { lat: 42.3520, lng: -71.0410, label: 'Seaport Hub',       type: 'hub'   },
  downtown:      { lat: 42.3554, lng: -71.0605, label: 'Downtown Crossing', type: 'stop'  },
  back_bay:      { lat: 42.3503, lng: -71.0810, label: 'Back Bay',          type: 'stop'  },
  fenway:        { lat: 42.3467, lng: -71.0972, label: 'Fenway',            type: 'stop'  },
  cambridge:     { lat: 42.3736, lng: -71.1097, label: 'Cambridge',         type: 'hub'   },
  charlestown:   { lat: 42.3782, lng: -71.0602, label: 'Charlestown',       type: 'stop'  },
  north_end:     { lat: 42.3647, lng: -71.0542, label: 'North End',         type: 'stop'  },
  east_boston:   { lat: 42.3751, lng: -71.0392, label: 'East Boston',       type: 'stop'  },
  south_boston:  { lat: 42.3381, lng: -71.0476, label: 'South Boston',      type: 'stop'  },
  roxbury:       { lat: 42.3151, lng: -71.0850, label: 'Roxbury',           type: 'stop'  },
  jamaica_plain: { lat: 42.3097, lng: -71.1150, label: 'Jamaica Plain',     type: 'stop'  },
  dorchester:    { lat: 42.3016, lng: -71.0676, label: 'Dorchester',        type: 'stop'  },
  allston:       { lat: 42.3529, lng: -71.1317, label: 'Allston',           type: 'stop'  },
  waterfront:    { lat: 42.3600, lng: -71.0490, label: 'Waterfront',        type: 'stop'  },
}

export const BOSTON_CENTER: [number, number] = [42.3453, -71.0857]
