import { NextResponse } from 'next/server'
import { FALLBACK_GAS_PRICE_PER_GALLON } from '@/lib/theme'

// EIA weekly retail regular-gasoline price, PADD 1A (New England) — covers Boston.
const EIA_URL =
  'https://api.eia.gov/v2/petroleum/pri/gnd/data/' +
  '?frequency=weekly&data[0]=value' +
  '&facets[duoarea][]=R1X&facets[product][]=EPMR' +
  '&sort[0][column]=period&sort[0][direction]=desc&length=1'

export interface GasPriceResponse {
  pricePerGallon: number
  period: string | null
  isFallback: boolean
}

export async function GET() {
  const apiKey = process.env.EIA_API_KEY

  if (!apiKey) {
    return NextResponse.json<GasPriceResponse>({
      pricePerGallon: FALLBACK_GAS_PRICE_PER_GALLON,
      period: null,
      isFallback: true,
    })
  }

  try {
    const res = await fetch(`${EIA_URL}&api_key=${apiKey}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`EIA ${res.status}`)

    const data = await res.json()
    const row = data?.response?.data?.[0]
    const price = Number(row?.value)
    if (!row || Number.isNaN(price)) throw new Error('EIA returned no usable price')

    return NextResponse.json<GasPriceResponse>({
      pricePerGallon: price,
      period: row.period ?? null,
      isFallback: false,
    })
  } catch {
    return NextResponse.json<GasPriceResponse>({
      pricePerGallon: FALLBACK_GAS_PRICE_PER_GALLON,
      period: null,
      isFallback: true,
    })
  }
}
