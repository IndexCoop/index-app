import Image from 'next/image'
import { Chain } from 'viem'
import { arbitrum, base, mainnet } from 'viem/chains'

type Props = {
  chain: Chain
}

const chainLogos: { [key: number]: string } = {
  [mainnet.id]: '/assets/network-base-dark.svg',
  [arbitrum.id]: '/assets/network-arbitrum-dark.svg',
  [base.id]: '/assets/network-ethereum-dark.svg',
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
