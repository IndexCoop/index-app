import { useCallback, useEffect, useState } from 'react'

import debounce from 'lodash/debounce'

import { Box, useDisclosure } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'

import { MAINNET, OPTIMISM, POLYGON } from '@/constants/chains'
import { Token } from '@/constants/tokens'
import { useApproval } from '@/lib/hooks/useApproval'
import { useFlashMintQuote } from '@/lib/hooks/useFlashMintQuote'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useTradeTokenLists } from '@/lib/hooks/useTradeTokenLists'
import { useWallet } from '@/lib/hooks/useWallet'
import { useBalanceData } from '@/lib/providers/Balances'
import { useSlippage } from '@/lib/providers/Slippage'
import { displayFromWei, isValidTokenInput, toWei } from '@/lib/utils'
import { getBlockExplorerContractUrl } from '@/lib/utils/blockExplorer'
import {
  getContractForQuote,
  getQuoteAmount,
} from '@/lib/utils/flashMint/quotes'
import { selectSlippage } from '@/lib/utils/slippage'
import { getNativeToken, isNotTradableToken } from '@/lib/utils/tokens'

import { TradeButtonContainer } from '../_shared/footer'
import {
  formattedBalance,
  formattedFiat,
  getHasInsufficientFunds,
} from '../_shared/QuickTradeFormatter'
import {
  getSelectTokenListItems,
  SelectTokenModal,
} from '../_shared/SelectTokenModal'
import { TransactionReview } from '../_shared/TransactionReview/TransactionReview'
import { TransactionReviewModal } from '../_shared/TransactionReview/TransactionReviewModal'
import { QuickTradeProps } from '../swap'

import DirectIssuance from './DirectIssuance'

const FlashMint = (props: QuickTradeProps) => {
  const { address } = useWallet()
  const { chainId, isSupportedNetwork } = useNetwork()
  const {
    isOpen: isInputOutputTokenModalOpen,
    onOpen: onOpenInputOutputTokenModal,
    onClose: onCloseInputOutputTokenModal,
  } = useDisclosure()
  const {
    isOpen: isIndexTokenModalOpen,
    onOpen: onOpenIndexTokenModal,
    onClose: onCloseIndexTokenModal,
  } = useDisclosure()
  const {
    isOpen: isTransactionReviewOpen,
    onOpen: onOpenTransactionReview,
    onClose: onCloseTransactionReview,
  } = useDisclosure()
  const {
    buyToken: indexToken,
    buyTokenList: indexTokenList,
    buyTokenPrice: indexTokenPrice,
    sellToken: inputOutputToken,
    sellTokenList: inputOutputTokenList,
    sellTokenPrice: inputOutputPrice,
    changeBuyToken: changeIndexToken,
    changeSellToken: changeInputOutputToken,
  } = useTradeTokenLists(props.singleToken, true)
  const { getTokenBalance } = useBalanceData()
  const { slippage } = useSlippage()

  const [contractAddress, setContractAddress] = useState<string | null>(null)
  const [indexTokenAmountFormatted, setIndexTokenAmountFormatted] =
    useState('0.0')
  const [inputOutputTokenAmount, setInputOutputTokenAmount] = useState(
    BigNumber.from(0)
  )
  const [indexTokenAmount, setIndexTokenAmount] = useState('0')
  const [isMinting, setIsMinting] = useState(true)
  const [transactionReview, setTransactionReview] =
    useState<TransactionReview | null>(null)

  const indexTokenAmountWei = toWei(indexTokenAmount, indexToken.decimals)

  const { fetchQuote, isFetchingQuote, quoteResult } = useFlashMintQuote()

  const {
    approve: approveIndexToken,
    isApproved: isApprovedIndexToken,
    isApproving: isApprovingIndexToken,
  } = useApproval(indexToken, contractAddress, indexTokenAmountWei)
  const {
    approve: approveInputOutputToken,
    isApproved: isApprovedInputOutputToken,
    isApproving: isApprovingInputOutputToken,
  } = useApproval(inputOutputToken, contractAddress, inputOutputTokenAmount)

  const hasInsufficientFundsInputOutputToken = getHasInsufficientFunds(
    false,
    inputOutputTokenAmount,
    getTokenBalance(inputOutputToken.symbol, chainId)
  )

  const hasInsufficientFundsIndexToken = getHasInsufficientFunds(
    false,
    indexTokenAmountWei,
    getTokenBalance(indexToken.symbol, chainId)
  )

  const getSlippage = useCallback(() => {
    const useSlippage = selectSlippage(
      slippage,
      indexToken.symbol,
      inputOutputToken.symbol
    )
    return useSlippage
  }, [inputOutputToken, indexToken, slippage])

  useEffect(() => {
    const contractAddress = getContractForQuote(quoteResult, chainId)
    setContractAddress(contractAddress)
    const inputOutputTokenAmount =
      getQuoteAmount(quoteResult, chainId) ?? BigNumber.from(0)
    setInputOutputTokenAmount(inputOutputTokenAmount)
  }, [chainId, quoteResult])

  useEffect(() => {
    const indexTokenAmountWei = toWei(indexTokenAmount, indexToken.decimals)
    const slippage = getSlippage()
    fetchQuote(
      isMinting,
      indexToken,
      inputOutputToken,
      indexTokenAmountWei,
      0,
      0,
      slippage
    )
  }, [indexToken, indexTokenAmount, inputOutputToken, isMinting, getSlippage])

  useEffect(() => {
    if (!transactionReview) return
    onOpenTransactionReview()
  }, [transactionReview])

  const approve = () => {
    if (isMinting) return approveInputOutputToken()
    return approveIndexToken()
  }

  const isApproved = () => {
    if (isMinting) {
      const isNativeCurrency =
        inputOutputToken.symbol === getNativeToken(chainId)?.symbol ?? ''
      return isNativeCurrency ? true : isApprovedInputOutputToken
    }
    return isApprovedIndexToken
  }

  const isApproving = () => {
    if (isMinting) return isApprovingInputOutputToken
    return isApprovingIndexToken
  }

  const getTradeButtonDisabledState = () => {
    if (!isSupportedNetwork) return true
    if (!address) return true
    return (
      indexTokenAmount === '0' ||
      (isMinting && hasInsufficientFundsInputOutputToken) ||
      (!isMinting && hasInsufficientFundsIndexToken) ||
      isNotTradableToken(props.singleToken, chainId)
    )
  }

  /**
   * Get the correct trade button label according to different states
   * @returns string label for trade button
   */
  const getTradeButtonLabel = () => {
    if (!address) return 'Connect Wallet'
    if (!isSupportedNetwork) return 'Wrong Network'

    if (isNotTradableToken(props.singleToken, chainId)) {
      let chainName = 'this Network'
      switch (chainId) {
        case MAINNET.chainId:
          chainName = 'Mainnet'
          break
        case POLYGON.chainId:
          chainName = 'Polygon'
          break
        case OPTIMISM.chainId:
          chainName = 'Optimism'
          break
      }

      return `Not Available on ${chainName}`
    }

    if (indexTokenAmount === '0') {
      return 'Enter an amount'
    }

    if (isMinting && hasInsufficientFundsInputOutputToken) {
      return 'Insufficient funds'
    }

    if (!isMinting && hasInsufficientFundsIndexToken) {
      return 'Insufficient funds'
    }

    if (isApproving()) {
      return 'Approving...'
    }

    if (!isApproved()) {
      return 'Approve Token'
    }

    return 'Review Transaction'
  }

  const getTransactionReview = (): TransactionReview | null => {
    if (isFetchingQuote) return null
    if (chainId && contractAddress && quoteResult) {
      const slippage = getSlippage()
      return {
        chainId,
        contractAddress,
        isMinting,
        inputToken: isMinting ? inputOutputToken : indexToken,
        outputToken: isMinting ? indexToken : inputOutputToken,
        inputTokenAmount: isMinting
          ? inputOutputTokenAmount
          : indexTokenAmountWei,
        outputTokenAmount: isMinting
          ? indexTokenAmountWei
          : inputOutputTokenAmount,
        quoteResult,
        slippage,
      }
    }
    return null
  }

  const resetData = () => {
    setIndexTokenAmount('0')
    setIndexTokenAmountFormatted('0.0')
  }

  const onChangeIndexTokenAmount = debounce((token: Token, input: string) => {
    if (input === '') {
      resetData()
      return
    }
    if (!isValidTokenInput(input, token.decimals)) return
    setIndexTokenAmount(input || '0')
  }, 1000)

  const onClickTradeButton = async () => {
    if (!address) return
    if (isMinting && hasInsufficientFundsInputOutputToken) return
    if (!isMinting && hasInsufficientFundsIndexToken) return

    if (!isApproved()) {
      await approve()
      return
    }

    // Open transaction review modal
    const transactionReview = getTransactionReview()
    setTransactionReview(transactionReview)
  }

  // SelectTokenModal
  const inputOutputTokenBalances = inputOutputTokenList.map(
    (inputOutputToken) =>
      getTokenBalance(inputOutputToken.symbol, chainId) ?? BigNumber.from(0)
  )
  const outputTokenBalances = indexTokenList.map(
    (indexToken) =>
      getTokenBalance(indexToken.symbol, chainId) ?? BigNumber.from(0)
  )
  const inputOutputTokenItems = getSelectTokenListItems(
    inputOutputTokenList,
    inputOutputTokenBalances,
    chainId
  )
  const indexTokenItems = getSelectTokenListItems(
    indexTokenList,
    outputTokenBalances,
    chainId
  )

  // DirectIssuance
  const isNarrow = props.isNarrowVersion ?? false
  const inputOutputTokenAmountFormatted = formattedBalance(
    inputOutputToken,
    inputOutputTokenAmount
  )
  const inputOutputTokenBalanceFormatted = formattedBalance(
    inputOutputToken,
    getTokenBalance(inputOutputToken.symbol, chainId)
  )
  const indexTokenFiatFormatted = formattedFiat(
    parseFloat(indexTokenAmount),
    indexTokenPrice
  )
  const inputOutputTokenFiatFormatted = formattedFiat(
    parseFloat(
      displayFromWei(inputOutputTokenAmount, 2, inputOutputToken.decimals) ??
        '0'
    ),
    inputOutputPrice
  )

  // TradeButtonContainer
  const buttonLabel = 'getTradeButtonLabel()'
  const isButtonDisabled = getTradeButtonDisabledState()
  const isLoading = isApproving() || isFetchingQuote
  const contractBlockExplorerUrl =
    contractAddress === null
      ? null
      : getBlockExplorerContractUrl(contractAddress, chainId)

  return (
    <Box mt='32px'>
      <DirectIssuance
        indexToken={indexToken}
        indexTokenList={indexTokenList}
        indexTokenAmountFormatted={indexTokenAmountFormatted}
        indexTokenFiatFormatted={indexTokenFiatFormatted}
        inputOutputToken={inputOutputToken}
        inputOutputTokenAmountFormatted={inputOutputTokenAmountFormatted}
        inputOutputTokenBalanceFormatted={inputOutputTokenBalanceFormatted}
        inputOutputTokenFiatFormatted={inputOutputTokenFiatFormatted}
        isIssue={isMinting}
        isMintable={true}
        isNarrow={isNarrow}
        onChangeBuyTokenAmount={onChangeIndexTokenAmount}
        onSelectIndexToken={() => {
          if (indexTokenItems.length > 1) onOpenIndexTokenModal()
        }}
        onSelectInputOutputToken={() => {
          if (inputOutputTokenItems.length > 1) onOpenInputOutputTokenModal()
        }}
        onToggleIssuance={(isMinting) => setIsMinting(isMinting)}
        priceImpact={undefined}
      />
      <TradeButtonContainer
        indexToken={indexToken}
        inputOutputToken={inputOutputToken}
        buttonLabel={buttonLabel}
        isButtonDisabled={isButtonDisabled}
        isLoading={isLoading}
        showMevProtectionMessage={true}
        onClickTradeButton={onClickTradeButton}
        contractAddress={contractAddress}
        contractExplorerUrl={contractBlockExplorerUrl}
      ></TradeButtonContainer>
      <SelectTokenModal
        isOpen={isInputOutputTokenModalOpen}
        onClose={onCloseInputOutputTokenModal}
        onSelectedToken={(tokenSymbol) => {
          changeInputOutputToken(tokenSymbol)
          onCloseInputOutputTokenModal()
        }}
        items={inputOutputTokenItems}
      />
      <SelectTokenModal
        isOpen={isIndexTokenModalOpen}
        onClose={onCloseIndexTokenModal}
        onSelectedToken={(tokenSymbol) => {
          if (
            tokenSymbol === 'ETH2X-FLI-P' ||
            tokenSymbol === 'BTC2x-FLI-P' ||
            tokenSymbol === 'MATIC2x-FLI-P'
          ) {
            alert(
              `${tokenSymbol} is currently sell only. Please use Swap instead of FlashMint.`
            )
          } else {
            changeIndexToken(tokenSymbol)
          }
          onCloseIndexTokenModal()
        }}
        items={indexTokenItems}
      />
      {transactionReview && (
        <TransactionReviewModal
          isOpen={isTransactionReviewOpen}
          onClose={onCloseTransactionReview}
          tx={transactionReview}
        />
      )}
    </Box>
  )
}

export default FlashMint
