import { useCallback, useEffect, useMemo, useState } from 'react'
import { parseUnits } from 'viem'

import { ClaimablePanel } from '@/app/prt-staking/components/prt-section/claimable-panel'
import { SafeSignButton } from '@/app/prt-staking/components/prt-section/safe-sign-button'
import { StakedPanel } from '@/app/prt-staking/components/prt-section/staked-panel'
import {
  WidgetHeader,
  WidgetHeaderTokenData,
} from '@/app/prt-staking/components/prt-section/widget-header'
import { WidgetTabs } from '@/app/prt-staking/components/prt-section/widget-tabs'
import { usePrtStakingContext } from '@/app/prt-staking/provider'
import { ProductRevenueToken, WidgetTab } from '@/app/prt-staking/types'
import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { useFormattedBalance } from '@/components/swap/hooks/use-swap/use-formatted-balance'
import { TradeButton } from '@/components/trade-button'
import { useApproval } from '@/lib/hooks/use-approval'
import { formatTokenDataToToken, formatWeiAsNumber } from '@/lib/utils'

type Props = {
  token: ProductRevenueToken
  onClose: () => void
}

export function PrtWidget({ token, onClose }: Props) {
  const {
    accountAddress,
    canStake,
    claimPrts,
    claimableRewardsFormatted,
    refetchClaimableRewards,
    refetchUserStakedBalance,
    stakePrts,
    unstakePrts,
    userStakedBalance,
    userStakedBalanceFormatted,
  } = usePrtStakingContext()
  const [currentTab, setCurrentTab] = useState(WidgetTab.STAKE)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inputAmount, setInputAmount] = useState('')
  const [tradeAmount, setTradeAmount] = useState<bigint>(BigInt(0))
  const selectedToken = useMemo(
    () => formatTokenDataToToken(token.stakeTokenData),
    [token.stakeTokenData],
  )
  const { balance: prtBalance, forceRefetch } = useFormattedBalance(
    selectedToken,
    accountAddress,
  )
  const {
    isApproved,
    isApproving,
    approve: onApprove,
  } = useApproval(
    selectedToken,
    token.stakedTokenData.address,
    parseUnits(inputAmount, token.stakedTokenData.decimals),
  )

  useEffect(() => {
    if (currentTab === WidgetTab.STAKE) {
      if (prtBalance > BigInt(0)) {
        setInputAmount(
          formatWeiAsNumber(prtBalance, selectedToken.decimals).toString(),
        )
      } else {
        setInputAmount('')
      }
      setTradeAmount(prtBalance)
    }
    if (currentTab === WidgetTab.UNSTAKE) {
      setInputAmount('')
      setTradeAmount(BigInt(0))
    }
    if (currentTab === WidgetTab.CLAIM) {
      setInputAmount(
        claimableRewardsFormatted > 0
          ? claimableRewardsFormatted.toString()
          : '',
      )
      setTradeAmount(BigInt(0))
    }
  }, [
    claimableRewardsFormatted,
    currentTab,
    prtBalance,
    selectedToken.decimals,
  ])

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

  const balance = useMemo(() => {
    if (currentTab === WidgetTab.STAKE) {
      return formatWeiAsNumber(prtBalance, selectedToken.decimals)
    }
    if (currentTab === WidgetTab.UNSTAKE) {
      return userStakedBalanceFormatted
    }
    if (currentTab === WidgetTab.CLAIM) {
      return claimableRewardsFormatted
    }
    return 0
  }, [
    claimableRewardsFormatted,
    currentTab,
    prtBalance,
    selectedToken.decimals,
    userStakedBalanceFormatted,
  ])

  const inputAmountNumber = Number(inputAmount)
  const balanceNumber = Number(balance)

  const isTradeButtonDisabled =
    inputAmountNumber === 0 ||
    (currentTab === WidgetTab.STAKE && !canStake) ||
    inputAmountNumber > balanceNumber

  const onClickTradeButton = async () => {
    if (isTradeButtonDisabled) return
    setIsSubmitting(true)
    try {
      if (currentTab === WidgetTab.STAKE) {
        if (!isApproved) {
          const approved = await onApprove()
          if (!approved) {
            throw new Error('Transaction not approved')
          }
        }
        await stakePrts(tradeAmount)
        await forceRefetch()
        await refetchUserStakedBalance()
      } else if (currentTab === WidgetTab.UNSTAKE) {
        await unstakePrts(tradeAmount)
        await forceRefetch()
        await refetchUserStakedBalance()
      } else if (currentTab === WidgetTab.CLAIM) {
        await claimPrts()
        await refetchClaimableRewards()
      }
      setInputAmount('')
      setTradeAmount(BigInt(0))
      setIsSubmitting(false)
    } catch (e) {
      console.error('Caught error in onClickTradeButton', e)
      setIsSubmitting(false)
    }
  }

  const onClickBalance = useCallback(() => {
    if (currentTab === WidgetTab.STAKE) {
      setInputAmount(
        formatWeiAsNumber(prtBalance, selectedToken.decimals).toString(),
      )
      setTradeAmount(prtBalance)
    } else if (currentTab === WidgetTab.UNSTAKE) {
      setInputAmount(userStakedBalanceFormatted.toString())
      setTradeAmount(userStakedBalance ?? BigInt(0))
    }
  }, [
    currentTab,
    prtBalance,
    selectedToken.decimals,
    userStakedBalance,
    userStakedBalanceFormatted,
  ])

  return (
    <div className='w-full min-w-80 flex-1 flex-col space-y-5 rounded-3xl bg-gray-50 p-6 sm:min-w-96'>
      <WidgetHeader
        tokenData={token.rewardTokenData as WidgetHeaderTokenData}
        onClose={onClose}
      />
      <WidgetTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab === WidgetTab.CLAIM ? <ClaimablePanel /> : <StakedPanel />}
      <TradeInputSelector
        config={{ isReadOnly: false }}
        balance={balance.toString()}
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
        isDisabled={isTradeButtonDisabled}
        isLoading={isSubmitting || isApproving}
        onClick={onClickTradeButton}
      />
      <SafeSignButton />
    </div>
  )
}
