import { Token } from "@/constants/tokens"

export interface BaseTokenStats {
  symbol: string
  price: number
  change24h: number
  low24h: number
  high24h: number
}

export type EnrichedToken = Token & {
  balance: string | null
  nav?: number
  size?: string
}
