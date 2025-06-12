import { ETH } from '../../../constants/tokens'

export const fetchCoingeckoTokenPrice = async (
  address: string,
  chainId: number,
  baseCurrency = 'usd',
): Promise<number> => {
  if (address.toLowerCase() === ETH.address!.toLowerCase()) {
    const priceUrl = `/api/price/coingecko/simple/price/?ids=ethereum&vs_currencies=${baseCurrency}`
    const res = await fetch(priceUrl)
    const data = await res.json()

    if (data === 0 || !data['ethereum']) return 0

    return data['ethereum'][baseCurrency]
  }

  const priceUrl = `/api/price/coingecko/simple/token-price/?chainId=${chainId.toString()}&contract_addresses=${address}&vs_currencies=${baseCurrency}`
  const res = await fetch(priceUrl)
  const data = await res.json()

  if (!data) return 0

  return data[address][baseCurrency]
}
