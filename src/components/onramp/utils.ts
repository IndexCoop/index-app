import { useMemo } from 'react'
import { Address } from 'viem'

import { useWallet } from '@/lib/hooks/use-wallet'

function formatAddress(address: Address): string {
  return `ethereum:${address}`
}

function generateUrl(address?: Address) {
  const url =
    'https://buy.onramper.com?apiKey=pk_prod_01HREVCX1YJDHAHQ6BE777J41B&mode=buy&defaultCrypto=usdc_ethereum&onlyCryptos=dai_ethereum,usdc_ethereum,usdt_ethereum,eth,weth_ethereum,gusd_ethereum,eth_arbitrum,usdc_arbitrum,usdt_arbitrum&onlyCryptoNetworks=ethereum,arbitrum?themeName=light&containerColor=fcffffff&primaryColor=0f1717ff&secondaryColor=fcffffff&cardColor=f5f7f7ff&primaryTextColor=0f1717ff&secondaryTextColor=627171ff&borderRadius=0.5&wgBorderRadius=1'
  if (address !== undefined) {
    // https://docs.onramper.com/docs/buy-widget#network-wallets
    url.concat(`&networkWallets=${formatAddress(address)}`)
  }
  console.log('onramper-url:', url)
  return url
}

export function useOnramperUrl(): string {
  const { address } = useWallet()
  const url = useMemo(() => generateUrl(address), [address])
  return url
}
