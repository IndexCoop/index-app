import { useEffect, useState } from 'react'

import { useColorStyles } from 'styles/colors'

import {
  Box,
  Flex,
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
import { useIssuance } from 'hooks/issuance/useIssuance'
import { useTradeFlashMintLeveraged } from 'hooks/useTradeFlashMintLeveraged'
import { useTradeFlashMintNotional } from 'hooks/useTradeFlashMintNotional'
import { useTradeFlashMintZeroEx } from 'hooks/useTradeFlashMintZeroEx'
import { getBlockExplorerContractUrl } from 'utils/blockExplorer'

import { TradeButton } from '../footer/TradeButton'

import FromTo from './FromTo'
import NetworkBadge from './NetworkBadge'
import { TransactionReview } from './TransactionReview'
import TransactionReviewDetails from './TransactionReviewDetails'
import TransactionReviewSimulation from './TransactionReviewSimulation'

type TransactionReviewModalProps = {
  isOpen: boolean
  onClose: () => void
  tx: TransactionReview
}

const useTrade = (tx: TransactionReview) => {
  const { handleTrade, isTrading } = useIssuance()

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
    isTrading ||
    isTransactingNotional ||
    isTransactingLeveraged ||
    isTransactingZeroEx

  const txWouldFail: boolean =
    txWouldFailZeroEx || txWouldFailLeveraged || txWouldFailFmNotional

  const executeTrade = async (override: boolean) => {
    const { quoteResult, slippage } = tx
    const quotes = quoteResult.quotes
    if (!quotes) return null
    if (quotes.flashMintPerp) {
      const {
        inputToken,
        inputTokenAmount,
        isMinting,
        outputToken,
        outputTokenAmount,
      } = tx
      const indexToken = isMinting ? outputToken : inputToken
      const indexTokenAmountWei = isMinting
        ? outputTokenAmount
        : inputTokenAmount
      const inputOutputTokenAmount = isMinting
        ? inputTokenAmount
        : outputTokenAmount
      await handleTrade(
        tx.isMinting,
        slippage,
        indexToken,
        indexTokenAmountWei,
        inputOutputTokenAmount
      )
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
  const { chainId } = tx
  const backgroundColor = styles.background

  const { executeTrade, isTransacting, txWouldFail } = useTrade(tx)

  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [override, setOverride] = useState(false)

  const contractBlockExplorerUrl = getBlockExplorerContractUrl(
    tx.contractAddress,
    chainId
  )

  useEffect(() => {
    console.log(props.tx, 'updated')
  }, [props.tx])

  useEffect(() => {
    setIsButtonDisabled(txWouldFail && !override)
  }, [override, txWouldFail])

  // TODO: isLoading when simulating
  useEffect(() => {
    setIsLoading(isTransacting)
  }, [isTransacting])

  const onChangeOverride = (isChecked: boolean) => {
    setOverride(isChecked)
  }

  const onSubmit = async () => {
    if (txWouldFail && !override) return
    console.log('submit')
    await executeTrade(override)
    onClose()
  }

  const shouldShowOverride = txWouldFail

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
          <Text>FlashMint - Review transaction</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p='16px'>
          <Flex direction='column' h='100%' w='100%'>
            <Flex mb='16px'>
              <Spacer />
              <Flex direction='column'>
                <FromTo
                  inputToken={tx.inputToken.image}
                  inputTokenAmount={tx.inputTokenAmount.toString()}
                  inputTokenSymbol={tx.inputToken.symbol}
                  outputToken={tx.outputToken.image}
                  outputTokenAmount={tx.outputTokenAmount.toString()}
                  outputTokenSymbol={tx.outputToken.symbol}
                />
                <Flex mt='16px'>
                  <NetworkBadge network={'Ethereum'} />
                </Flex>
              </Flex>
              <Spacer />
            </Flex>
            <Spacer />
            <Box m='8px'>
              <TransactionReviewSimulation />
            </Box>
            {shouldShowOverride ? (
              <Box m='8px'>
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
