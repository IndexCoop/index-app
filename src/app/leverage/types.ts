import { Chain } from 'viem'

import { Token } from '@/constants/tokens'

export enum LeverageType {
  Long2x,
  Long3x,
  Short,
}

export enum LeverageMarket {
  BTCUSD = 'BTC / USD',
  ETHUSD = 'ETH / USD',
  BTCETH = 'BTC / ETH',
  ETHBTC = 'ETH / BTC',
}

export type LeverageRatio = {
  icon: string
  chain: Chain
  market: LeverageMarket
  strategy: LeverageStrategy
  ratio?: number
}

export enum LeverageStrategy {
  Long2x = '2x',
  Long3x = '3x',
  Short1x = '-1x',
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
  leverageType: LeverageType | null
}

export interface LeverageToken extends Token {
  address: string
  baseToken: string
  leverageType: LeverageType
}

export interface Market {
  icon: string
  market: string
  networks: Chain[]
  price: number
  change24h: number
  symbol: 'ETH' | 'BTC'
  currency: 'USD' | 'BTC' | 'ETH'
}

export type ChartTab = 'indexcoop-chart' | 'tradingview-chart'
