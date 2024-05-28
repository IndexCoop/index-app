import { Token } from "@/constants/tokens"

import { LeverageType } from "./provider"

export interface BaseTokenStats {
  symbol: string
  price: number
  change24h: number
  low24h: number
  high24h: number
}

export type EnrichedToken = Token & {
  balance: string | null
  size?: string
  leverageType?: LeverageType | null
}
