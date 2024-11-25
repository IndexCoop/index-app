export const buildEarnTradePath = (
  symbol: string,
  network: number | string = 1,
) => `/earn?buy=${symbol}&sell=ETH&network=${network}`

export const buildLeverageTradePath = (symbol: string) =>
  `/leverage?buy=${symbol}&sell=ETH&network=1`

export const buildSwapTradePath = (symbol: string) =>
  `/swap/eth/${symbol.toLowerCase()}`
