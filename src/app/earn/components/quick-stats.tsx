import { useDisclosure } from '@chakra-ui/react'

import { TokenSelector } from '@/app/earn/components/earn-widget/components/base-token-selector'
import { StatMetric } from '@/app/earn/components/stat-metric'
import { formatPercentage, formatTvl } from '@/app/products/utils/formatters'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { useWallet } from '@/lib/hooks/use-wallet'
import { formatDollarAmount } from '@/lib/utils'

import { digitsByAddress } from '@/lib/utils/tokens'
import { getTagline } from '../constants'
import { useEarnContext } from '../provider'

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
    nav,
    apy,
    apy30d,
    apy7d,
    tvl,
    onSelectIndexToken,
  } = useEarnContext()
  const { address } = useWallet()

  return (
    <div className='border-ic-gray-200 from-ic-white to-ic-gray-50 flex w-full items-center justify-between rounded-lg border bg-gradient-to-b'>
      <div className='flex w-full items-center justify-between px-4 py-2 sm:py-3 md:px-8 md:py-4'>
        <div className='flex items-center gap-4'>
          <TokenSelector
            selectedToken={indexToken}
            onClick={onOpenSelectIndexToken}
          />
          <div className='hidden text-xs font-normal lg:flex'>
            {getTagline(indexToken.symbol)}
          </div>
        </div>
        <StatMetric
          className='w-16'
          isLoading={isFetchingStats}
          label='APY'
          value={formatPercentage(apy, true)}
        />
        <StatMetric
          className='w-20'
          isLoading={isFetchingStats}
          label='TVL'
          value={formatTvl(tvl)}
        />
        <StatMetric
          className='hidden w-24 sm:flex'
          isLoading={isFetchingStats}
          label='Token Price'
          value={formatDollarAmount(
            nav,
            true,
            digitsByAddress(indexToken.address ?? ''),
          )}
        />
        <StatMetric
          isLoading={isFetchingStats}
          className='hidden w-16 md:flex'
          label='7d APY'
          value={formatPercentage(apy7d, true)}
        />
        <StatMetric
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
          onSelectIndexToken(tokenSymbol)
          onCloseSelectIndexToken()
        }}
        address={address}
        tokens={indexTokens}
      />
    </div>
  )
}
