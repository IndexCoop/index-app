export const buildEarnTradePath = (
  buySymbol: string,
  sellSymbol: string = 'ETH',
  network: number | string = 1,
) => `/earn?buy=${buySymbol}&sell=${sellSymbol}&network=${network}`

export const buildLeverageTradePath = (buySymbol: string) =>
  `/leverage?buy=${buySymbol}&sell=ETH&network=1`

export const buildSwapTradePath = (buySymbol: string) =>
  `/swap/eth/${buySymbol.toLowerCase()}`
