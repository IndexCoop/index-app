import { TradeButton } from '@/components/trade-button'

import { useTransactionReview } from '../provider'
import { TransactionReview } from '../types'

import { BottomMessage } from './bottom-message'
import { ContractSection } from './contract-section'
import { FromTo } from './from-to'
import { NetworkBadge } from './network-badge'
import { Override } from './override'

export type ReviewProps = {
  onSubmitWithSuccess: (success: boolean) => void
  transactionReview: TransactionReview
}

export function Review(props: ReviewProps) {
  const { transactionReview } = props
  const {
    contractBlockExplorerUrl,
    formattedInputTokenAmount,
    formattedOutputTokenAmount,
    isButtonDisabled,
    isLoading,
    shouldShowOverride,
    onChangeOverride,
    onSubmit,
  } = useTransactionReview(props)
  return (
    <div className='flex h-full w-full flex-col'>
      <div className='flex w-full flex-col items-center'>
        <div className='my-1 flex'>
          <NetworkBadge />
        </div>
        <FromTo
          inputToken={transactionReview.inputToken.image}
          inputTokenAmount={formattedInputTokenAmount}
          inputTokenSymbol={transactionReview.inputToken.symbol}
          outputToken={transactionReview.outputToken.image}
          outputTokenAmount={formattedOutputTokenAmount}
          outputTokenSymbol={transactionReview.outputToken.symbol}
        />
      </div>
      <div className='my-2'>
        <div className='mb-2'>
          <ContractSection
            contractAddress={transactionReview.contractAddress}
            explorerUrl={contractBlockExplorerUrl}
          />
        </div>
        {/* <TransactionReviewSimulation state={simulationState} /> */}
      </div>
      {shouldShowOverride ? (
        <div className='my-2'>
          <Override onChange={onChangeOverride} />
        </div>
      ) : (
        <BottomMessage />
      )}
      <TradeButton
        isDisabled={isButtonDisabled}
        isLoading={isLoading}
        label={'Submit Transaction'}
        onClick={onSubmit}
      />
    </div>
  )
}
