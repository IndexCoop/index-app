import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'

import { useProtectionContext } from '@/lib/providers/protection'

export function useIsTokenPairTradable(
  outputTokenSymbol: string,
  chainId: number,
): boolean {
  const { isForbiddenAddress, isRestrictedCountry } = useProtectionContext()
  if (isForbiddenAddress) return false
  if (!isRestrictedCountry) return true
  // When tokenlists is used everywhere, we can just pass these objects as function
  // arguments instead of the token symbol
  const outputToken = getTokenByChainAndSymbol(chainId, outputTokenSymbol)

  const outputTokenIsDangerous =
    outputToken?.tags.some((tag) => tag === 'dangerous') ?? false

  return !outputTokenIsDangerous
}
