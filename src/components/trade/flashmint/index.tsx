import { useEffect, useState } from 'react'

import debounce from 'lodash/debounce'

import { Box, useDisclosure } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'

import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import { Token } from 'constants/tokens'
import { useApproval } from 'hooks/useApproval'
import { useFlashMintQuote } from 'hooks/useFlashMintQuote'
import { useNetwork } from 'hooks/useNetwork'
import { useTradeTokenLists } from 'hooks/useTradeTokenLists'
import { useWallet } from 'hooks/useWallet'
import { useBalanceData } from 'providers/Balances'
import { useSlippage } from 'providers/Slippage'
import { displayFromWei, isValidTokenInput, toWei } from 'utils'
import { getBlockExplorerContractUrl } from 'utils/blockExplorer'
import { getContractForQuote, getQuoteAmount } from 'utils/quotes'
import {
  getNativeToken,
  isNotTradableToken,
  isTokenMintable,
} from 'utils/tokens'

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

// const useSelectTokenListItems = (tokenList: Token[]) => {
//   const { getTokenBalance } = useBalanceData()
//
//   const balances = useMemo(
//     () =>
//       // FIXME: chainId
//       tokenList.map(
//         (token) => getTokenBalance(token.symbol, 1) ?? BigNumber.from(0)
//       ),
//     [tokenList]
//   )
//
//   return useMemo(
//     () => getSelectTokenListItems(tokenList, balances, 0),
//     [tokenList]
//   )
// }

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
  const [isMintable, setIsMintable] = useState(true)
  const [isMinting, setIsMinting] = useState(true)

  const indexTokenAmountWei = toWei(indexTokenAmount, indexToken.decimals)

  const { fetchQuote, isFetchingQuote, quoteResult } = useFlashMintQuote()

  const {
    isApproved: isApprovedInputOutputToken,
    isApproving: isApprovingInputOutputToken,
    onApprove: onApproveInputOutputToken,
  } = useApproval(
    inputOutputToken,
    contractAddress ?? undefined,
    inputOutputTokenAmount
  )
  const {
    isApproved: isApprovedIndexToken,
    isApproving: isApprovingIndexToken,
    onApprove: onApproveIndexToken,
  } = useApproval(indexToken, contractAddress ?? undefined, indexTokenAmountWei)

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

  useEffect(() => {
    const contractAddress = getContractForQuote(quoteResult, chainId)
    setContractAddress(contractAddress)
    const inputOutputTokenAmount =
      getQuoteAmount(quoteResult, chainId) ?? BigNumber.from(0)
    setInputOutputTokenAmount(inputOutputTokenAmount)
  }, [chainId, quoteResult])

  useEffect(() => {
    const isMintable = isTokenMintable(indexToken)
    setIsMintable(isMintable)
  }, [chainId, indexToken])

  useEffect(() => {
    const indexTokenAmountWei = toWei(indexTokenAmount, indexToken.decimals)
    fetchQuote(
      isMinting,
      indexToken,
      inputOutputToken,
      indexTokenAmountWei,
      0,
      0,
      slippage
    )
  }, [indexToken, indexTokenAmount, inputOutputToken, isMinting])

  const getTransactionReview = (): TransactionReview | null => {
    if (isFetchingQuote) return null
    if (chainId && contractAddress) {
      return {
        chainId,
        contractAddress,
        inputToken: isMinting ? inputOutputToken : indexToken,
        outputToken: isMinting ? indexToken : inputOutputToken,
        inputTokenAmount: isMinting
          ? inputOutputTokenAmount
          : indexTokenAmountWei,
        outputTokenAmount: isMinting
          ? indexTokenAmountWei
          : inputOutputTokenAmount,
      }
    }
    return null
  }

  const approve = () => {
    if (isMinting) return onApproveInputOutputToken()
    return onApproveIndexToken()
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
    if (isMinting && !isTokenMintable(indexToken)) return true
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
      return 'Approve Tokens'
    }

    return 'Review Transaction'
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
    onOpenTransactionReview()
    return
    if (!address) return
    if (isMinting && hasInsufficientFundsInputOutputToken) return
    if (!isMinting && hasInsufficientFundsIndexToken) return

    if (!isApproved()) {
      await approve()
      return
    }

    onOpenTransactionReview()
  }

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

  const buttonLabel = getTradeButtonLabel()
  const isButtonDisabled = getTradeButtonDisabledState()
  const isLoading = isApproving() || isFetchingQuote
  const isNarrow = props.isNarrowVersion ?? false

  const contractBlockExplorerUrl =
    contractAddress === null
      ? null
      : getBlockExplorerContractUrl(contractAddress, chainId)

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

  const transactionReview = getTransactionReview()

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
        isMintable={isMintable}
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
          changeIndexToken(tokenSymbol)
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
