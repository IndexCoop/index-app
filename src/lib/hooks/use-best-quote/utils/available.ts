export function isAvailableForFlashMint(tokenSymbol: string): boolean {
  switch (tokenSymbol) {
    case 'INDEX':
      return false
    default:
      return true
  }
}
