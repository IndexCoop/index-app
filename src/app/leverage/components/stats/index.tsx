import { useDisclosure } from '@chakra-ui/react'

import { BaseTokenSelector } from '@/app/leverage/components/leverage-widget/components/base-token-selector'
import { StatsMetric } from '@/app/leverage/components/stats/stats-metric'
import { useLeverageToken } from '@/app/leverage/provider'
import { formatPercentage, formatTvl } from '@/app/products/utils/formatters'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { useWallet } from '@/lib/hooks/use-wallet'
import { formatDollarAmount } from '@/lib/utils'
import { digitsByAddress } from '@/lib/utils/tokens'

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
  const { baseToken, indexToken } = useLeverageToken()
  const { address } = useWallet()

  const apy = 0
  const apy7d = 0
  const apy30d = 0
  const nav = 0
  const tvl = 0
  const isFetchingStats = false

  return (
    <div className='bg-ic-gray-950 flex w-full items-center justify-between rounded-lg border border-[#627171]'>
      <div className='flex w-full items-center justify-between px-4 py-2 sm:py-3 md:px-8 md:py-4'>
        <div className='flex items-center gap-4'>
          <BaseTokenSelector
            baseToken={baseToken}
            onClick={onOpenSelectIndexToken}
          />
        </div>
        <StatsMetric
          className='w-16'
          isLoading={isFetchingStats}
          label='APY'
          value={formatPercentage(apy, true)}
        />
        <StatsMetric
          className='w-20'
          isLoading={isFetchingStats}
          label='TVL'
          value={formatTvl(tvl)}
        />
        <StatsMetric
          className='hidden w-24 sm:flex'
          isLoading={isFetchingStats}
          label='Token Price'
          value={formatDollarAmount(
            nav,
            true,
            digitsByAddress(indexToken.address ?? ''),
          )}
        />
        <StatsMetric
          isLoading={isFetchingStats}
          className='hidden w-16 md:flex'
          label='7d APY'
          value={formatPercentage(apy7d, true)}
        />
        <StatsMetric
          className='hidden w-16 md:flex'
          isLoading={isFetchingStats}
          label='30d APY'
          value={formatPercentage(apy30d, true)}
        />
      </div>
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
