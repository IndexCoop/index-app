import { useEffect, useMemo, useState } from 'react'

import {
  Box,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
} from '@chakra-ui/react'

import { Quote, QuoteType } from '@/lib/hooks/use-best-quote/types'
import { useSimulateQuote } from '@/lib/hooks/use-simulate-quote'
import { useTrade } from '@/lib/hooks/use-trade'
import { useColorStyles } from '@/lib/styles/colors'
import { displayFromWei } from '@/lib/utils'
import { getBlockExplorerContractUrl } from '@/lib/utils/block-explorer'

import { TradeButton } from '@/components/trade-button'

import { formatQuoteAnalytics, useAnalytics } from '@/lib/hooks/use-analytics'
import { FromTo } from './components/from-to'
import { Override } from './components/override'
import { NetworkBadge } from './components/network-badge'
import {
  TransactionReviewSimulation,
  TransactionReviewSimulationState,
} from './components/simulation'
import { SubmissionResult } from './components/submission-result'
import { TransactionReview } from './types'

enum TransactionReviewModalState {
  failed,
  submit,
  success,
}

type TransactionReviewModalProps = {
  isOpen: boolean
  transactionReview: TransactionReview
  onClose: () => void
}

export const TransactionReviewModal = (props: TransactionReviewModalProps) => {
  const { styles } = useColorStyles()
  const { isOpen, onClose, transactionReview } = props
  const backgroundColor = styles.background

  const [state, setState] = useState<TransactionReviewModalState>(
    TransactionReviewModalState.submit,
  )

  const onCloseModal = () => {
    // Make sure to reset state, so that reopening popup doesn't show wrong state
    setState(TransactionReviewModalState.submit)
    onClose()
  }

  const onDone = () => {
    onCloseModal()
  }

  const onSubmitWithSuccess = (success: boolean) => {
    const modalState = success
      ? TransactionReviewModalState.success
      : TransactionReviewModalState.failed
    setState(modalState)
  }

  const modalTitle =
    state === TransactionReviewModalState.submit ? 'Review Transaction' : ''

  return (
    <Modal
      onClose={onCloseModal}
      isOpen={isOpen}
      isCentered
      scrollBehavior='inside'
    >
      <ModalOverlay
        bg='rgba(0, 0, 0, 0.6)'
        backdropFilter='auto'
        backdropBlur='8px'
      />
      <ModalContent
        backgroundColor={backgroundColor}
        borderColor={styles.border}
        borderRadius='10'
        borderStyle='solid'
        borderWidth='2px'
        m={['16px', 0]}
      >
        <ModalHeader>
          <Text>{modalTitle}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p='0 16px 16px 16px'>
          {(state === TransactionReviewModalState.failed ||
            state === TransactionReviewModalState.success) && (
            <SubmissionResult
              onClick={onDone}
              success={state === TransactionReviewModalState.success}
            />
          )}
          {state === TransactionReviewModalState.submit && (
            <Review
              onSubmitWithSuccess={onSubmitWithSuccess}
              transactionReview={transactionReview}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const BottomMessage = () => {
  const { styles } = useColorStyles()
  return (
    <Text
      align='center'
      color={styles.text3}
      fontSize='sm'
      fontWeight='500'
      mt='8px'
      mb='16px'
    >
      Submitting will open your currently connected wallet to confirm and sign
      the transaction.
    </Text>
  )
}

const ContractSection = ({
  contractAddress,
  explorerUrl,
}: {
  contractAddress: string
  explorerUrl: string
}) => {
  const { styles } = useColorStyles()
  return (
    <Flex
      border='1px solid'
      borderColor={styles.border}
      borderRadius='16px'
      p='16px'
      w='100%'
    >
      <Text fontSize='lg' fontWeight='500'>
        Contract
      </Text>
      <Spacer />
      <Link
        href={explorerUrl}
        isExternal
        style={{ textDecoration: 'underline' }}
      >
        {`${contractAddress.substring(0, 8)}...`}
      </Link>
    </Flex>
  )
}

function useSelectedQuote(review: TransactionReview) {
  const { quoteResults, selectedQuote } = review
  const quote = useMemo(() => {
    if (selectedQuote === QuoteType.flashmint) {
      return quoteResults.results.flashmint!.quote
    }
    if (selectedQuote === QuoteType.redemption) {
      return quoteResults.results.redemption!.quote
    }
    return quoteResults.results.zeroex!.quote
  }, [quoteResults, selectedQuote])
  return { quote }
}

const useTradeMaker = (quote: Quote | null) => {
  const { executeTrade, isTransacting, txWouldFail } = useTrade()

  /**
   * Returns boolean indicating success or null for config error
   */
  const makeTrade = async (override: boolean) => {
    if (!quote) return null
    try {
      await executeTrade(quote, override)
      return true
    } catch {
      return false
    }
  }

  return { isTransacting, makeTrade, txWouldFail }
}

type ReviewProps = {
  onSubmitWithSuccess: (success: boolean) => void
  transactionReview: TransactionReview
}

const Review = (props: ReviewProps) => {
  const { onSubmitWithSuccess, transactionReview } = props
  const { quote } = useSelectedQuote(transactionReview)
  const { simulateTrade } = useSimulateQuote(quote?.tx ?? null)
  const { makeTrade, isTransacting } = useTradeMaker(quote)
  const { logEvent } = useAnalytics()

  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [override, setOverride] = useState(false)
  const [simulationState, setSimulationState] =
    useState<TransactionReviewSimulationState>(
      TransactionReviewSimulationState.default,
    )

  useEffect(() => {
    // Reset state for new data
    setSimulationState(TransactionReviewSimulationState.default)
  }, [props.transactionReview])

  useEffect(() => {
    logEvent('Transaction Review', formatQuoteAnalytics(quote))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (simulationState === TransactionReviewSimulationState.loading) {
      setIsButtonDisabled(true)
      return
    }

    if (
      !override &&
      simulationState === TransactionReviewSimulationState.failure
    ) {
      setIsButtonDisabled(true)
      return
    }

    setIsButtonDisabled(false)
  }, [override, simulationState])

  useEffect(() => {
    setIsLoading(isTransacting)
  }, [isTransacting])

  const onChangeOverride = (isChecked: boolean) => {
    setOverride(isChecked)
  }

  const onSubmit = async () => {
    setSimulationState(TransactionReviewSimulationState.loading)
    const isSuccess = await simulateTrade()
    const state = isSuccess
      ? TransactionReviewSimulationState.success
      : TransactionReviewSimulationState.failure
    setSimulationState(state)
    console.log('isSuccess', isSuccess)
    if (!isSuccess && !override) return
    const success = await makeTrade(override)
    if (success === null) return
    onSubmitWithSuccess(success)
  }

  const contractBlockExplorerUrl = getBlockExplorerContractUrl(
    transactionReview.contractAddress,
    transactionReview.chainId,
  )

  const decimals = 10
  const formattedInputTokenAmount =
    displayFromWei(
      transactionReview.inputTokenAmount,
      decimals,
      transactionReview.inputToken.decimals,
    ) ?? ''
  const formattedOutputTokenAmount =
    displayFromWei(
      transactionReview.outputTokenAmount,
      decimals,
      transactionReview.outputToken.decimals,
    ) ?? ''

  const shouldShowOverride =
    simulationState === TransactionReviewSimulationState.failure

  return (
    <Flex direction='column' h='100%' w='100%'>
      <Flex>
        <Flex align='center' direction='column' w='100%'>
          <Flex my='4px'>
            <NetworkBadge />
          </Flex>
          <FromTo
            inputToken={transactionReview.inputToken.image}
            inputTokenAmount={formattedInputTokenAmount}
            inputTokenSymbol={transactionReview.inputToken.symbol}
            outputToken={transactionReview.outputToken.image}
            outputTokenAmount={formattedOutputTokenAmount}
            outputTokenSymbol={transactionReview.outputToken.symbol}
          />
        </Flex>
      </Flex>
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
    </Flex>
  )
}
