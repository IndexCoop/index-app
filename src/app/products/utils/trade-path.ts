export const buildEarnTradePath = (symbol: string) =>
  `/earn?buy=${symbol}&sell=ETH&network=1`

export const buildLeverageTradePath = (symbol: string) =>
  `/leverage?buy=${symbol}&sell=ETH&network=1`

export const buildSwapTradePath = (symbol: string) =>
  `/swap/eth/${symbol.toLowerCase()}`
