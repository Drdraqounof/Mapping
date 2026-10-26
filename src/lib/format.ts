export function formatDuration(minutes: number): string {
  const total = Math.round(minutes)
  if (total < 60) return `${total} min`
  const h = Math.floor(total / 60)
  const m = total % 60
  return m ? `${h} hr ${m} min` : `${h} hr`
}

export function formatKm(km: number): string {
  return `${km.toFixed(1)} km`
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`
}
