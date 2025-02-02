import Image from 'next/image'
import { Chain } from 'viem'
import { arbitrum, base, mainnet } from 'viem/chains'

type Props = {
  chain: Chain
}

export const chainLogos: { [key: number]: string } = {
  [base.id]: '/assets/network-base-dark.svg',
  [arbitrum.id]: '/assets/network-arbitrum-dark.svg',
  [mainnet.id]: '/assets/network-ethereum-dark.svg',
}

export function MarketNetworkImage({ chain }: Props) {
  return (
    <Image
      className='opacity-70'
      src={chainLogos[chain.id]}
      alt={`${chain.name} logo`}
      height={12}
      width={12}
    />
  )
}
