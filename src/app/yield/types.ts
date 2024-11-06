import { Token } from '@/constants/tokens'

export interface BaseTokenStats {
  symbol: string
  price: number
  change24h: number
  low24h: number
  high24h: number
}

export type EnrichedToken = Token & {
  balance: bigint
  usd?: number
  unitPriceUsd?: number
  size?: string
}

export type ChartTab = 'apy' | 'tvl' | 'price'
