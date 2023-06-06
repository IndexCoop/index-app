import { useEffect, useState } from 'react'

import { useColorStyles } from 'styles/colors'

import { CheckCircleIcon } from '@chakra-ui/icons'
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

import Override from 'components/trade/flashmint/Override'
import { useFlashMintTrade } from 'hooks/useFlashMintTrade'
import { useSimulateQuote } from 'hooks/useSimulateQuote'
import { useTradeFlashMintLeveraged } from 'hooks/useTradeFlashMintLeveraged'
import { useTradeFlashMintNotional } from 'hooks/useTradeFlashMintNotional'
import { useTradeFlashMintZeroEx } from 'hooks/useTradeFlashMintZeroEx'
import { displayFromWei } from 'utils'
import { getBlockExplorerContractUrl } from 'utils/blockExplorer'

import { TradeButton } from '../footer/TradeButton'

import FromTo from './FromTo'
import NetworkBadge from './NetworkBadge'
import { TransactionReview } from './TransactionReview'
import TransactionReviewDetails from './TransactionReviewDetails'
import TransactionReviewSimulation, {
  TransactionReviewSimulationState,
} from './TransactionReviewSimulation'

enum TransactionReviewModalState {
  submit,
  success,
}

type TransactionReviewModalProps = {
  isOpen: boolean
  onClose: () => void
  tx: TransactionReview
}

const useTrade = (tx: TransactionReview) => {
  const {
    executeFlashMintTrade,
    isTransacting: isTransactingFlashMint,
    txWouldFail: txWouldFailFM,
  } = useFlashMintTrade()
  const {
    executeFlashMintLeveragedTrade,
    isTransacting: isTransactingLeveraged,
    txWouldFail: txWouldFailLeveraged,
  } = useTradeFlashMintLeveraged()
  const {
    executeFlashMintNotionalTrade,
    isTransacting: isTransactingNotional,
    txWouldFail: txWouldFailFmNotional,
  } = useTradeFlashMintNotional()
  const {
    executeFlashMintZeroExTrade,
    isTransacting: isTransactingZeroEx,
    txWouldFail: txWouldFailZeroEx,
  } = useTradeFlashMintZeroEx()

  const isTransacting =
    isTransactingFlashMint ||
    isTransactingNotional ||
    isTransactingLeveraged ||
    isTransactingZeroEx

  const txWouldFail: boolean =
    txWouldFailFM ||
    txWouldFailZeroEx ||
    txWouldFailLeveraged ||
    txWouldFailFmNotional

  const executeTrade = async (override: boolean) => {
    const { quoteResult, slippage } = tx
    const { quotes } = quoteResult
    if (!quotes) return null

    if (quotes.flashMint) {
      await executeFlashMintTrade(quotes.flashMint, slippage, override)
      return
    }
    if (quotes.flashMintLeveraged) {
      await executeFlashMintLeveragedTrade(
        quotes.flashMintLeveraged,
        slippage,
        override
      )
      return
    }
    if (quotes.flashMintNotional) {
      await executeFlashMintNotionalTrade(
        quotes.flashMintNotional,
        slippage,
        override
      )
      return
    }
    if (quotes.flashMintZeroEx) {
      await executeFlashMintZeroExTrade(
        quotes.flashMintZeroEx,
        slippage,
        override
      )
      return
    }
  }

  return { executeTrade, isTransacting, txWouldFail }
}

export const TransactionReviewModal = (props: TransactionReviewModalProps) => {
  const { styles } = useColorStyles()
  const { isOpen, onClose, tx } = props
  const backgroundColor = styles.background

  const [state, setState] = useState<TransactionReviewModalState>(
    TransactionReviewModalState.submit
  )

  const onDone = () => {
    onClose()
  }

  const onSubmitWithSuccess = (success: boolean) => {
    if (!success) return
    setState(TransactionReviewModalState.success)
  }

  const modalTitle =
    state === TransactionReviewModalState.submit
      ? 'FlashMint - Review transaction'
      : ''

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior='inside'>
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
          {state === TransactionReviewModalState.success && (
            <SubmissionSuccessful onClick={onDone} />
          )}
          {state === TransactionReviewModalState.submit && (
            <Review onSubmitWithSuccess={onSubmitWithSuccess} tx={tx} />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

/**
 // TODO:
<Box my='8px'>
  <TransactionReviewDetails />
</Box>
*/

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

type ReviewProps = {
  onSubmitWithSuccess: (success: boolean) => void
  tx: TransactionReview
}

const Review = (props: ReviewProps) => {
  const { onSubmitWithSuccess, tx } = props
  const { simulateTrade } = useSimulateQuote(tx.quoteResult)
  const { executeTrade, isTransacting, txWouldFail } = useTrade(tx)

  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [override, setOverride] = useState(false)
  const [simulationState, setSimulationState] =
    useState<TransactionReviewSimulationState>(
      TransactionReviewSimulationState.default
    )

  useEffect(() => {
    setSimulationState(TransactionReviewSimulationState.default)
  }, [props.tx])

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
    await executeTrade(override)
    onSubmitWithSuccess(true)
  }

  const contractBlockExplorerUrl = getBlockExplorerContractUrl(
    tx.contractAddress,
    tx.chainId
  )

  const decimals = 10
  const formattedInputTokenAmount =
    displayFromWei(tx.inputTokenAmount, decimals, tx.inputToken.decimals) ?? ''
  const formattedOutputTokenAmount =
    displayFromWei(tx.outputTokenAmount, decimals, tx.outputToken.decimals) ??
    ''

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
            inputToken={tx.inputToken.image}
            inputTokenAmount={formattedInputTokenAmount}
            inputTokenSymbol={tx.inputToken.symbol}
            outputToken={tx.outputToken.image}
            outputTokenAmount={formattedOutputTokenAmount}
            outputTokenSymbol={tx.outputToken.symbol}
          />
        </Flex>
      </Flex>
      <Box my='8px'>
        <Box mb='8px'>
          <ContractSection
            contractAddress={tx.contractAddress}
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

const SubmissionSuccessful = ({ onClick }: { onClick: () => void }) => {
  return (
    <Flex align='center' direction={'column'}>
      <Flex align='center' direction={'column'} p='16px'>
        <CheckCircleIcon w='32px' h='32px' />
        <Text align='center' fontSize='3xl' p='16px'>
          You successfully submitted the transaction.
        </Text>
      </Flex>
      <Spacer />
      <TradeButton
        isDisabled={false}
        isLoading={false}
        label={'Done'}
        onClick={onClick}
      />
    </Flex>
  )
}
