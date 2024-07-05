import { useCallback, useMemo, useState } from 'react'
import { parseUnits } from 'viem'

import { ClaimablePanel } from '@/app/prt-staking/components/prt-section/claimable-panel'
import { StakedPanel } from '@/app/prt-staking/components/prt-section/staked-panel'
import { WidgetHeader } from '@/app/prt-staking/components/prt-section/widget-header'
import { WidgetTabs } from '@/app/prt-staking/components/prt-section/widget-tabs'
import { usePrtStakingContext } from '@/app/prt-staking/provider'
import { ProductRevenueToken, WidgetTab } from '@/app/prt-staking/types'
import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TradeButton } from '@/components/trade-button'
import { HighYieldETHIndex } from '@/constants/tokens'

type Props = {
  token: ProductRevenueToken
  onClose: () => void
}

export function PrtWidget({ token, onClose }: Props) {
  const { claimPrts, stakePrts, unstakePrts } = usePrtStakingContext()
  const [currentTab, setCurrentTab] = useState(WidgetTab.STAKE)
  const selectedToken = HighYieldETHIndex
  const [inputAmount, setInputAmount] = useState('')

  const inputSelectorCaption = useMemo(() => {
    if (currentTab === WidgetTab.STAKE) return 'You stake'
    if (currentTab === WidgetTab.UNSTAKE) return 'You unstake'
    if (currentTab === WidgetTab.CLAIM) return 'Claimable'
    return ''
  }, [currentTab])
  const buttonLabel = useMemo(() => {
    if (currentTab === WidgetTab.STAKE) return 'Stake'
    if (currentTab === WidgetTab.UNSTAKE) return 'Unstake'
    if (currentTab === WidgetTab.CLAIM) return 'Claim Rewards'
    return ''
  }, [currentTab])

  const onClick = useCallback(() => {
    if (currentTab === WidgetTab.STAKE) {
      stakePrts(parseUnits(inputAmount, token.prtTokenData.decimals))
      return
    }
    if (currentTab === WidgetTab.UNSTAKE) {
      unstakePrts(parseUnits(inputAmount, token.prtTokenData.decimals))
      return
    }
    if (currentTab === WidgetTab.CLAIM) {
      claimPrts()
      return
    }
  }, [
    claimPrts,
    currentTab,
    inputAmount,
    stakePrts,
    token.prtTokenData.decimals,
    unstakePrts,
  ])

  return (
    <div className='w-full min-w-80 flex-1 flex-col space-y-5 rounded-3xl bg-gray-50 p-6 sm:min-w-96'>
      <WidgetHeader tokenData={token.tokenData} onClose={onClose} />
      <WidgetTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab === WidgetTab.CLAIM ? <ClaimablePanel /> : <StakedPanel />}
      <TradeInputSelector
        config={{ isReadOnly: false }}
        balance={'1'}
        caption={inputSelectorCaption}
        formattedFiat=''
        selectedToken={selectedToken}
        selectedTokenAmount={'1'}
        showSelectorButtonChevron={false}
        onChangeInput={(_, amount) => setInputAmount(amount)}
        onClickBalance={() => {}}
        onSelectToken={() => {}}
      />
      <TradeButton
        label={buttonLabel}
        isDisabled={false}
        isLoading={false}
        onClick={onClick}
      />
    </div>
  )
}
