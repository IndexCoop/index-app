export function getFlashMintGasDefault(symbol: string) {
  switch (symbol) {
    case 'hyETH':
      return 250_000
    case 'icETH':
      return 1_500_000
    default:
      return 2_000_000
  }
}
