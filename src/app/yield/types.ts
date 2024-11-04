import { Token } from '@/constants/tokens'

export enum LeverageType {
  Long2x,
  Long3x,
  Short,
}

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
  leverageType?: LeverageType | null
}

export interface LeverageToken extends Token {
  address: string
  baseToken: string
  leverageType: LeverageType
}

export type ChartTab = 'indexcoop-chart' | 'tradingview-chart'
