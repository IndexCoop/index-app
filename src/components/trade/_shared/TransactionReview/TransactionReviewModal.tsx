import { useEffect, useState } from 'react'

import { useColorStyles, useICColorMode } from 'styles/colors'

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

const useTrade = () => {
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

  // TODO:
  const txWouldFail: boolean =
    txWouldFailZeroEx || txWouldFailLeveraged || txWouldFailFmNotional

  // TODO:
  const executeTrade = async () => {
    // Trade depending on quote result available
    // const quotes = quoteResult.quotes
    // if (!quotes || !chainId) return null
    // if (quotes.flashMintPerp) {
    //   await handleTrade(
    //     isMinting,
    //     slippage,
    //     indexToken,
    //     indexTokenAmountWei,
    //     inputOutputTokenAmount
    //   )
    //   resetData()
    //   return
    // }
    // if (quotes.flashMintLeveraged) {
    //   await executeFlashMintLeveragedTrade(
    //     quotes.flashMintLeveraged,
    //     slippage,
    //     override
    //   )
    //   resetData()
    //   return
    // }
    // if (quotes.flashMintNotional) {
    //   await executeFlashMintNotionalTrade(
    //     quotes.flashMintNotional,
    //     slippage,
    //     override
    //   )
    //   resetData()
    //   return
    // }
    // if (quotes.flashMintZeroEx) {
    //   await executeFlashMintZeroExTrade(
    //     quotes.flashMintZeroEx,
    //     slippage,
    //     override
    //   )
    //   resetData()
    //   return
    // }
  }

  return { executeTrade, isTransacting, txWouldFail }
}

export const TransactionReviewModal = (props: TransactionReviewModalProps) => {
  const { isDarkMode } = useICColorMode()
  const { styles } = useColorStyles()
  const { isOpen, onClose, tx } = props
  const { chainId } = tx
  const backgroundColor = styles.background

  const { executeTrade, isTransacting, txWouldFail } = useTrade()

  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // TODO:
  const [override, setOverride] = useState(false)

  const contractBlockExplorerUrl = getBlockExplorerContractUrl(
    tx.contractAddress,
    chainId
  )

  const onSubmit = async () => {
    if (txWouldFail && !override) return
    console.log('submit')
    // TODO:
    // await executeTrade()
    // TODO: close modal
  }

  const onChangeOverride = (isChecked: boolean) => {
    setOverride(isChecked)
  }

  useEffect(() => {
    console.log(props.tx, 'updated')
  }, [props.tx])

  useEffect(() => {
    setIsButtonDisabled(txWouldFail && !override)
  }, [override, txWouldFail])

  // TODO:
  useEffect(() => {
    setIsLoading(isTransacting)
  }, [isTransacting])

  // TODO:
  const shouldShowOverride = false

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
