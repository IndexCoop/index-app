import { ARBITRUM, MAINNET, OPTIMISM } from '@/constants/chains'
import { useNetwork } from '@/lib/hooks/use-network'

import { SelectorButton } from './selector-button'

type NetworkSelectorProps = {
  onSelectNetwork: (chainId: number) => void
}

export function NetworkSelector(props: NetworkSelectorProps) {
  const { chainId } = useNetwork()
  return (
    <div className='flex flex-col gap-3'>
      <div className='text-xs font-normal text-gray-100'>Network</div>
      <div className='flex flex-row gap-1'>
        <SelectorButton
          imagePath={{
            selected: '/assets/selector-network-arbitrum.png',
            disabled: '/assets/selector-network-arbitrum-disabled.png',
          }}
          isSelected={chainId === ARBITRUM.chainId}
          onClick={() => {
            props.onSelectNetwork(ARBITRUM.chainId)
          }}
        />
        <SelectorButton
          imagePath={{
            selected: '/assets/selector-network-ethereum.png',
            disabled: '/assets/selector-network-ethereum-disabled.png',
          }}
          isSelected={chainId === MAINNET.chainId}
          onClick={() => {
            props.onSelectNetwork(MAINNET.chainId)
          }}
        />
        <SelectorButton
          imagePath={{
            selected: '/assets/selector-network-base.png',
            disabled: '/assets/selector-network-base-disabled.png',
          }}
          isSelected={chainId === OPTIMISM.chainId}
          onClick={() => {
            props.onSelectNetwork(OPTIMISM.chainId)
          }}
        />
      </div>
    </div>
  )
}
