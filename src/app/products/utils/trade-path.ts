export const buildEarnTradePath = (
  buySymbol: string,
  sellSymbol: string = 'ETH',
  network: number | string = 1,
) => `/earn?buy=${buySymbol}&sell=${sellSymbol}&network=${network}`

export const buildLeverageTradePath = (
  buySymbol: string,
  sellSymbol: string = 'ETH',
  network: number | string = 1,
) => `/leverage?buy=${buySymbol}&sell=${sellSymbol}&network=${network}`

export const buildSwapTradePath = (
  buySymbol: string,
  sellSymbol: string = 'ETH',
) => `/swap/${sellSymbol.toLowerCase()}/${buySymbol.toLowerCase()}`
