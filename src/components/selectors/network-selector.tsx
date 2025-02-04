import { useAppKit } from '@reown/appkit/react'
import { useCallback } from 'react'
import { useWalletClient } from 'wagmi'

import { NetworkSelectorButton } from '@/components/selectors/network-selector-button'
import { ARBITRUM, BASE, MAINNET } from '@/constants/chains'

export function NetworkSelector() {
  const { open } = useAppKit()
  const { data: walletClient } = useWalletClient()
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
      <div className='text-ic-gray-600 text-xs font-normal dark:text-gray-100'>
        Network
      </div>
      <div className='flex flex-row gap-1 sm:gap-2'>
        <NetworkSelectorButton
          chain={MAINNET}
          imagePath={{
            light: '/assets/network-ethereum-light.svg',
            dark: '/assets/network-ethereum-dark.svg',
          }}
          onClick={handleClick}
        />
        <NetworkSelectorButton
          chain={ARBITRUM}
          imagePath={{
            light: '/assets/network-arbitrum-light.svg',
            dark: '/assets/network-arbitrum-dark.svg',
          }}
          onClick={handleClick}
        />
        <NetworkSelectorButton
          chain={BASE}
          imagePath={{
            light: '/assets/network-base-light.svg',
            dark: '/assets/network-base-dark.svg',
          }}
          onClick={handleClick}
        />
      </div>
    </div>
  )
}
