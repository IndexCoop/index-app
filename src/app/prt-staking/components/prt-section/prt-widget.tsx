import { useCallback, useEffect, useMemo, useState } from 'react'
import { parseUnits } from 'viem'

import { ClaimablePanel } from '@/app/prt-staking/components/prt-section/claimable-panel'
import { StakedPanel } from '@/app/prt-staking/components/prt-section/staked-panel'
import { WidgetHeader } from '@/app/prt-staking/components/prt-section/widget-header'
import { WidgetTabs } from '@/app/prt-staking/components/prt-section/widget-tabs'
import { usePrtStakingContext } from '@/app/prt-staking/provider'
import { ProductRevenueToken, WidgetTab } from '@/app/prt-staking/types'
import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { useFormattedBalance } from '@/components/swap/hooks/use-swap/use-formatted-balance'
import { TradeButton } from '@/components/trade-button'
import { useApproval } from '@/lib/hooks/use-approval'
import { formatAmount, formatTokenDataToToken } from '@/lib/utils'

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inputAmount, setInputAmount] = useState('')
  const selectedToken = useMemo(
    () => formatTokenDataToToken(token.stakeTokenData),
    [token.stakeTokenData],
  )
  const { balanceFormatted: prtBalance, forceRefetch } = useFormattedBalance(
    selectedToken,
    accountAddress,
  )
  const { isApproved, approve: onApprove } = useApproval(
    selectedToken,
    token.stakedTokenData.address,
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

  const balance = useMemo(() => {
    if (currentTab === WidgetTab.STAKE) {
      return prtBalance
    }
    if (currentTab === WidgetTab.UNSTAKE) {
      return formatAmount(userStakedBalance, 3)
    }
    if (currentTab === WidgetTab.CLAIM) {
      return formatAmount(claimableRewards, 3)
    }
    return formatAmount(0, 3)
  }, [claimableRewards, currentTab, prtBalance, userStakedBalance])

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
        await stakePrts(parseUnits(inputAmount, token.stakeTokenData.decimals))
        await forceRefetch()
        await refetchUserStakedBalance()
      } else if (currentTab === WidgetTab.UNSTAKE) {
        await unstakePrts(
          parseUnits(inputAmount, token.stakeTokenData.decimals),
        )
        await forceRefetch()
        await refetchUserStakedBalance()
      } else if (currentTab === WidgetTab.CLAIM) {
        await claimPrts()
        await refetchClaimableRewards()
      }
      setInputAmount('')
      setIsSubmitting(false)
    } catch (e) {
      console.error('Caught error in onClickTradeButton', e)
      setIsSubmitting(false)
    }
  }

  const onClickBalance = useCallback(() => {
    if (currentTab === WidgetTab.STAKE) {
      setInputAmount(prtBalance.toString())
    } else if (currentTab === WidgetTab.UNSTAKE) {
      setInputAmount(userStakedBalance.toString())
    }
  }, [currentTab, prtBalance, userStakedBalance])

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
        isDisabled={isTradeButtonDisabled || isSubmitting}
        isLoading={false}
        onClick={onClickTradeButton}
      />
    </div>
  )
}
