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
    const { data, error } = await getCoingeckoSimplePrice(
      'ethereum',
      baseCurrency,
    )

    if (error || !data || !data['ethereum']) return 0

    return data['ethereum'][baseCurrency]
  }

  const { data, error } = await getCoingeckoTokenPrice(
    chainId,
    address,
    baseCurrency,
  )

  if (error || !data || !data[address]) return 0

  return data[address][baseCurrency]
}
