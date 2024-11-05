import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useCallback } from 'react'
import { useWalletClient } from 'wagmi'

import { ARBITRUM, BASE, MAINNET } from '@/constants/chains'
import { useNetwork } from '@/lib/hooks/use-network'

import { SelectorButton } from './selector-button'

export function NetworkSelector() {
  const { open } = useWeb3Modal()
  const { data: walletClient } = useWalletClient()
  const { chainId } = useNetwork()
  const handleClick = useCallback(
    (chainId: number) => {
      if (!walletClient) {
        open({ view: 'Connect' })
      }
      walletClient?.switchChain({ id: chainId })
    },
    [open, walletClient],
  )

  return (
    <div className='flex flex-col gap-3'>
      <div className='text-xs font-normal text-gray-100'>Network</div>
      <div className='flex flex-row gap-1 sm:gap-2'>
        <SelectorButton
          imagePath={{
            selected: '/assets/selector-network-ethereum.png',
            disabled: '/assets/selector-network-ethereum-disabled.png',
          }}
          isSelected={chainId === MAINNET.chainId}
          onClick={() => handleClick(MAINNET.chainId)}
        />
        <SelectorButton
          imagePath={{
            selected: '/assets/selector-network-arbitrum.png',
            disabled: '/assets/selector-network-arbitrum-disabled.png',
          }}
          isSelected={chainId === ARBITRUM.chainId || !chainId}
          onClick={() => handleClick(ARBITRUM.chainId)}
        />
        <SelectorButton
          imagePath={{
            selected: '/assets/selector-network-base.png',
            disabled: '/assets/selector-network-base-disabled.png',
          }}
          isSelected={chainId === BASE.chainId}
          onClick={() => handleClick(BASE.chainId)}
        />
      </div>
    </div>
  )
}
