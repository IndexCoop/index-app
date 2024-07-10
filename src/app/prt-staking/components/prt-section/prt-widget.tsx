import { useCallback, useEffect, useMemo, useState } from 'react'
import { parseUnits } from 'viem'

import { ClaimablePanel } from '@/app/prt-staking/components/prt-section/claimable-panel'
import { StakedPanel } from '@/app/prt-staking/components/prt-section/staked-panel'
import { WidgetHeader } from '@/app/prt-staking/components/prt-section/widget-header'
import { WidgetTabs } from '@/app/prt-staking/components/prt-section/widget-tabs'
import { usePrtStakingContext } from '@/app/prt-staking/provider'
import { ProductRevenueToken, WidgetTab } from '@/app/prt-staking/types'
import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TradeButton } from '@/components/trade-button'
import { useApproval } from '@/lib/hooks/use-approval'
import { useBalance } from '@/lib/hooks/use-balance'
import { formatTokenDataToToken } from '@/lib/utils'

type Props = {
  token: ProductRevenueToken
  onClose: () => void
}

export function PrtWidget({ token, onClose }: Props) {
  const {
    accountAddress,
    canStake,
    claimPrts,
    claimableRewards,
    refetchClaimableRewards,
    refetchUserStakedBalance,
    stakePrts,
    unstakePrts,
    userStakedBalance,
  } = usePrtStakingContext()
  const [currentTab, setCurrentTab] = useState(WidgetTab.STAKE)
  const selectedToken = formatTokenDataToToken(token.stakeTokenData)
  const [inputAmount, setInputAmount] = useState('')
  const { balance: prtBalance, forceRefetch } = useBalance(
    token.stakeTokenData.address,
  )
  const { isApproved, approve: onApprove } = useApproval(
    selectedToken,
    accountAddress ?? null,
    parseUnits(inputAmount, token.stakedTokenData.decimals),
  )

  useEffect(() => {
    if (currentTab === WidgetTab.STAKE) setInputAmount('')
    if (currentTab === WidgetTab.UNSTAKE) setInputAmount('')
    if (currentTab === WidgetTab.CLAIM)
      setInputAmount(claimableRewards > 0 ? claimableRewards.toString() : '')
  }, [claimableRewards, currentTab])

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

  const onClickTradeButton = useCallback(async () => {
    if (currentTab === WidgetTab.STAKE) {
      if (!isApproved) {
        await onApprove()
      }
      await stakePrts(parseUnits(inputAmount, token.stakeTokenData.decimals))
      await forceRefetch()
    } else if (currentTab === WidgetTab.UNSTAKE) {
      await unstakePrts(parseUnits(inputAmount, token.stakeTokenData.decimals))
      await refetchUserStakedBalance()
    } else if (currentTab === WidgetTab.CLAIM) {
      await claimPrts()
      await refetchClaimableRewards()
    }
  }, [
    claimPrts,
    currentTab,
    forceRefetch,
    inputAmount,
    isApproved,
    onApprove,
    refetchClaimableRewards,
    refetchUserStakedBalance,
    stakePrts,
    token.stakeTokenData.decimals,
    unstakePrts,
  ])

  const onClickBalance = useCallback(() => {
    if (currentTab === WidgetTab.STAKE) {
      setInputAmount(prtBalance.toString())
    } else if (currentTab === WidgetTab.UNSTAKE) {
      setInputAmount(userStakedBalance.toString())
    }
  }, [currentTab, prtBalance, userStakedBalance])

  const balance = useMemo(() => {
    if (currentTab === WidgetTab.STAKE) {
      return prtBalance.toString()
    }
    if (currentTab === WidgetTab.UNSTAKE) {
      return userStakedBalance.toString()
    }
    if (currentTab === WidgetTab.CLAIM) {
      return claimableRewards.toString()
    }
    return '0'
  }, [claimableRewards, currentTab, prtBalance, userStakedBalance])

  return (
    <div className='w-full min-w-80 flex-1 flex-col space-y-5 rounded-3xl bg-gray-50 p-6 sm:min-w-96'>
      <WidgetHeader tokenData={token.rewardTokenData} onClose={onClose} />
      <WidgetTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab === WidgetTab.CLAIM ? <ClaimablePanel /> : <StakedPanel />}
      <TradeInputSelector
        config={{ isReadOnly: false }}
        balance={balance}
        caption={inputSelectorCaption}
        formattedFiat=''
        selectedToken={selectedToken}
        selectedTokenAmount={inputAmount}
        showSelectorButton={currentTab !== WidgetTab.CLAIM}
        showSelectorButtonChevron={false}
        onChangeInput={(_, amount) => setInputAmount(amount)}
        onClickBalance={onClickBalance}
        onSelectToken={() => {}}
      />
      <TradeButton
        label={buttonLabel}
        isDisabled={currentTab === WidgetTab.STAKE && !canStake}
        isLoading={false}
        onClick={onClickTradeButton}
      />
    </div>
  )
}
