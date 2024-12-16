import { useDisclosure } from '@chakra-ui/react'
import { useCallback } from 'react'

import { TokenSelector } from '@/app/earn/components/earn-widget/components/base-token-selector'
import { LeverageSelectorContainer } from '@/app/leverage/components/stats/leverage-selector-container'
import { StatsMetric } from '@/app/leverage/components/stats/stats-metric'
import { useLeverageToken } from '@/app/leverage/provider'
import { useFormattedLeverageData } from '@/app/leverage/use-formatted-data'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { useWallet } from '@/lib/hooks/use-wallet'

export function QuickStats() {
  const {
    isOpen: isSelectIndexTokenOpen,
    onOpen: onOpenSelectIndexToken,
    onClose: onCloseSelectIndexToken,
  } = useDisclosure()
  const {
    indexToken,
    indexTokens,
    isFetchingStats,
    isMinting,
    stats,
    onSelectInputToken,
    onSelectOutputToken,
  } = useLeverageToken()
  const { address } = useWallet()

  const { price, change24h, change24hIsPositive, low24h, high24h } =
    useFormattedLeverageData(stats)

  const onSelectIndexToken = useCallback(
    (tokenSymbol: string) => {
      if (isMinting) {
        onSelectOutputToken(tokenSymbol)
      } else {
        onSelectInputToken(tokenSymbol)
      }
    },
    [isMinting, onSelectInputToken, onSelectOutputToken],
  )

  return (
    <div
      className='bg-ic-gray-950 flex w-full items-center justify-between rounded-lg'
      style={{ boxShadow: '2px 2px 30px 0px rgba(0, 0, 0, 0.06)' }}
    >
      <div className='flex w-full items-center justify-between py-4 pl-6 pr-16'>
        <TokenSelector
          selectedToken={indexToken}
          onClick={onOpenSelectIndexToken}
        />
        <div className='text-ic-white hidden w-20 text-base font-semibold md:flex'>
          {price}
        </div>
        <StatsMetric
          className='hidden w-20 sm:flex'
          isLoading={isFetchingStats}
          label='24h Change'
          value={change24h}
          overrideLabelColor={
            change24hIsPositive ? 'text-ic-green' : 'text-ic-red'
          }
        />
        <StatsMetric
          isLoading={isFetchingStats}
          className='hidden w-16 lg:flex'
          label='24h High'
          value={high24h}
        />
        <StatsMetric
          className='hidden w-16 lg:flex'
          isLoading={isFetchingStats}
          label='24h Low'
          value={low24h}
        />
      </div>
      <LeverageSelectorContainer />
      <SelectTokenModal
        isDarkMode={true}
        isOpen={isSelectIndexTokenOpen}
        onClose={onCloseSelectIndexToken}
        onSelectedToken={(tokenSymbol) => {
          onSelectIndexToken(tokenSymbol)
          onCloseSelectIndexToken()
        }}
        address={address}
        tokens={indexTokens}
      />
    </div>
  )
}
