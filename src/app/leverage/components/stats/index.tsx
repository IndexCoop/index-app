import { useDisclosure } from '@chakra-ui/react'

import { BaseTokenSelector } from '@/app/leverage/components/leverage-widget/components/base-token-selector'
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
  //   const {
  //     indexToken,
  //     indexTokens,
  //     isFetchingStats,
  //     nav,
  //     apy,
  //     apy30d,
  //     apy7d,
  //     tvl,
  //     onSelectIndexToken,
  //   } = useEarnContext()
  const { baseToken, indexToken, stats } = useLeverageToken()
  const { address } = useWallet()

  const { price, change24h, change24hIsPositive, low24h, high24h } =
    useFormattedLeverageData(stats)

  const nav = 0
  const isFetchingStats = false

  return (
    <div
      className='bg-ic-gray-950 flex w-full items-center justify-between rounded-lg'
      style={{ boxShadow: '2px 2px 30px 0px rgba(0, 0, 0, 0.06)' }}
    >
      <div className='flex w-full items-center justify-between py-2 pl-6 pr-16'>
        <BaseTokenSelector
          baseToken={baseToken}
          onClick={onOpenSelectIndexToken}
        />
        <div className='text-ic-white text-base font-semibold'>{price}</div>
        <StatsMetric
          className='w-20'
          isLoading={isFetchingStats}
          label='24h Change'
          value={change24h}
        />
        <StatsMetric
          isLoading={isFetchingStats}
          className='hidden w-16 md:flex'
          label='24h High'
          value={high24h}
        />
        <StatsMetric
          className='hidden w-16 md:flex'
          isLoading={isFetchingStats}
          label='24h Low'
          value={low24h}
        />
      </div>
      <LeverageSelectorContainer />
      <SelectTokenModal
        isOpen={isSelectIndexTokenOpen}
        onClose={onCloseSelectIndexToken}
        onSelectedToken={(tokenSymbol) => {
          console.log(tokenSymbol)
          // TODO:
          //   onSelectIndexToken(tokenSymbol)
          onCloseSelectIndexToken()
        }}
        address={address}
        // TODO:
        tokens={[]}
      />
    </div>
  )
}
