import { useEffect, useState } from 'react'

import debounce from 'lodash/debounce'
import { useICColorMode } from 'styles/colors'

import { Box, useDisclosure } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import {
  getExchangeIssuanceLeveragedContractAddress,
  getExchangeIssuanceZeroExContractAddress,
} from '@indexcoop/flash-mint-sdk'

import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import { FlashMintPerp } from 'constants/contractAddresses'
import { Token } from 'constants/tokens'
import { useIssuance } from 'hooks/issuance/useIssuance'
import { useApproval } from 'hooks/useApproval'
import { useBalances } from 'hooks/useBalance'
import {
  FlashMintQuoteResult,
  useFlashMintQuote,
} from 'hooks/useFlashMintQuote'
import { useNetwork } from 'hooks/useNetwork'
import { useTradeExchangeIssuance } from 'hooks/useTradeExchangeIssuance'
import { useTradeLeveragedExchangeIssuance } from 'hooks/useTradeLeveragedExchangeIssuance'
import { useTradeTokenLists } from 'hooks/useTradeTokenLists'
import { useWallet } from 'hooks/useWallet'
import { useSlippage } from 'providers/Slippage'
import { isValidTokenInput, toWei } from 'utils'
import { getBlockExplorerContractUrl } from 'utils/blockExplorer'
import { getNativeToken, isNotTradableToken } from 'utils/tokens'

import DirectIssuance from './DirectIssuance'
import { QuickTradeProps } from './QuickTrade'
import {
  formattedBalance,
  getHasInsufficientFunds,
} from './QuickTradeFormatter'
import { getSelectTokenListItems, SelectTokenModal } from './SelectTokenModal'
import { TradeButtonContainer } from './TradeButtonContainer'

const FlashMint = (props: QuickTradeProps) => {
  const { address } = useWallet()
  const { chainId, isSupportedNetwork } = useNetwork()
  const { isDarkMode } = useICColorMode()
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
  const { executeEITrade, isTransactingEI } = useTradeExchangeIssuance()
  const { executeLevEITrade, isTransactingLevEI } =
    useTradeLeveragedExchangeIssuance()
  const {
    buyToken: indexToken,
    buyTokenList: indexTokenList,
    sellToken: inputOutputToken,
    sellTokenList: inputOutputTokenList,
    changeBuyToken: changeIndexToken,
    changeSellToken: changeInputOutputToken,
  } = useTradeTokenLists(props.singleToken, true)
  const { getBalance } = useBalances()
  const { slippage } = useSlippage()

  const [indexTokenAmountFormatted, setIndexTokenAmountFormatted] =
    useState('0.0')
  const [indexTokenAmount, setIndexTokenAmount] = useState('0')
  const [isMinting, setIsMinting] = useState(true)

  const indexTokenAmountWei = toWei(indexTokenAmount, indexToken.decimals)

  const { fetchQuote, isFetchingQuote, quoteResult } = useFlashMintQuote()
  const inputOutputTokenAmount =
    getQuoteAmount(quoteResult, chainId) ?? BigNumber.from(0)

  const contractAddress = getContractForQuote(quoteResult, chainId)
  const contractBlockExplorerUrl =
    contractAddress === null
      ? null
      : getBlockExplorerContractUrl(contractAddress, chainId)

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

  const { handleTrade, isTrading } = useIssuance()

  const hasInsufficientFundsInputOutputToken = getHasInsufficientFunds(
    false,
    inputOutputTokenAmount,
    getBalance(inputOutputToken.symbol)
  )

  const hasInsufficientFundsIndexToken = getHasInsufficientFunds(
    false,
    indexTokenAmountWei,
    getBalance(indexToken.symbol)
  )

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

  const approve = () => {
    if (isMinting) return onApproveInputOutputToken()
    return onApproveIndexToken()
  }

  const isApproved = () => {
    if (isMinting) return isApprovedInputOutputToken
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
      isTrading ||
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

    // For redeeming it will always be an index, so approval state should be checked
    const isNativeCurrency = isMinting
      ? inputOutputToken.symbol === getNativeToken(chainId)?.symbol ?? ''
      : false
    if (!isNativeCurrency && !isApproved()) {
      return 'Approve Tokens'
    }

    if (isTrading) {
      return 'Trading...'
    }

    return 'Trade'
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

    // Trade depending on quote result available
    const quotes = quoteResult.quotes
    if (!quotes || !chainId) return null

    if (quotes.flashMintPerp) {
      await handleTrade(
        isMinting,
        slippage,
        indexToken,
        indexTokenAmountWei,
        inputOutputTokenAmount
      )
      resetData()
      return
    }

    if (quotes.flashMintLeveraged) {
      await executeLevEITrade(quotes.flashMintLeveraged, slippage)
      resetData()
      return
    }

    if (quotes.flashMintZeroEx) {
      await executeEITrade(quotes.flashMintZeroEx, slippage)
      resetData()
      return
    }
  }

  const inputOutputTokenBalances = inputOutputTokenList.map(
    (inputOutputToken) =>
      getBalance(inputOutputToken.symbol) ?? BigNumber.from(0)
  )
  const outputTokenBalances = indexTokenList.map(
    (indexToken) => getBalance(indexToken.symbol) ?? BigNumber.from(0)
  )
  const inputOutputTokenItems = getSelectTokenListItems(
    inputOutputTokenList,
    inputOutputTokenBalances
  )
  const indexTokenItems = getSelectTokenListItems(
    indexTokenList,
    outputTokenBalances
  )

  const buttonLabel = getTradeButtonLabel()
  const isButtonDisabled = getTradeButtonDisabledState()
  const isLoading =
    isApproving() ||
    isFetchingQuote ||
    isTrading ||
    isTransactingEI ||
    isTransactingLevEI
  const isNarrow = props.isNarrowVersion ?? false

  const inputOutputTokenAmountFormatted = formattedBalance(
    inputOutputToken,
    inputOutputTokenAmount
  )
  const inputOutputTokenBalanceFormatted = formattedBalance(
    inputOutputToken,
    getBalance(inputOutputToken.symbol)
  )

  return (
    <Box mt='32px'>
      <DirectIssuance
        indexToken={indexToken}
        indexTokenList={indexTokenList}
        indexTokenAmountFormatted={indexTokenAmountFormatted}
        inputOutputToken={inputOutputToken}
        inputOutputTokenAmountFormatted={inputOutputTokenAmountFormatted}
        inputOutputTokenBalanceFormatted={inputOutputTokenBalanceFormatted}
        isDarkMode={isDarkMode}
        isIssue={isMinting}
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
      />
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
    </Box>
  )
}

const getContractForQuote = (
  quoteResult: FlashMintQuoteResult | null,
  chainId: number | undefined
): string | null => {
  const quotes = quoteResult?.quotes
  if (!quotes || !chainId) return null

  if (quotes.flashMintPerp) {
    return FlashMintPerp
  }

  if (quotes.flashMintLeveraged) {
    return getExchangeIssuanceLeveragedContractAddress(chainId)
  }

  if (quotes.flashMintZeroEx) {
    return getExchangeIssuanceZeroExContractAddress(chainId)
  }

  return null
}

const getQuoteAmount = (
  quoteResult: FlashMintQuoteResult | null,
  chainId: number | undefined
): BigNumber | null => {
  const quotes = quoteResult?.quotes
  if (!quotes || !chainId) return null

  if (quotes.flashMintPerp) {
    return quotes.flashMintPerp.inputOutputTokenAmount
  }

  if (quotes.flashMintLeveraged) {
    return quotes.flashMintLeveraged.inputOutputTokenAmount
  }

  if (quotes.flashMintZeroEx) {
    return quotes.flashMintZeroEx.inputOutputTokenAmount
  }

  return null
}

export default FlashMint
