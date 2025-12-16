import { ETH } from '@/constants/tokens'
import {
  getCoingeckoSimplePrice,
  getCoingeckoTokenPrice,
} from '@/lib/actions/price'

export const fetchCoingeckoTokenPrice = async (
  address: string,
  chainId: number,
  baseCurrency = 'usd',
): Promise<number> => {
  if (address.toLowerCase() === ETH.address!.toLowerCase()) {
    const result = await getCoingeckoSimplePrice('ethereum', baseCurrency)
    if (result.error) return 0
    const data = result.data

    if (!data || !data['ethereum']) return 0

    return data['ethereum'][baseCurrency]
  }

  const result = await getCoingeckoTokenPrice(chainId, address, baseCurrency)
  if (result.error) return 0
  const data = result.data

  if (!data || !data[address]) return 0

  return data[address][baseCurrency]
}
