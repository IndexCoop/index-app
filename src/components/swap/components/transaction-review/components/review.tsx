import { Box } from '@chakra-ui/react'

import { TradeButton } from '@/components/trade-button'

import { useTransactionReview } from '../provider'
import { TransactionReview } from '../types'
import { BottomMessage } from './bottom-message'
import { ContractSection } from './contract-section'
import { FromTo } from './from-to'
import { Override } from './override'
import { NetworkBadge } from './network-badge'
import { TransactionReviewSimulation } from './simulation'

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
    simulationState,
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
      <Box my='8px'>
        <Box mb='8px'>
          <ContractSection
            contractAddress={transactionReview.contractAddress}
            explorerUrl={contractBlockExplorerUrl}
          />
        </Box>
        <TransactionReviewSimulation state={simulationState} />
      </Box>
      {shouldShowOverride ? (
        <Box my='8px'>
          <Override onChange={onChangeOverride} />
        </Box>
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
