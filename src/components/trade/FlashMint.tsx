import { useEffect, useState } from 'react'

import debounce from 'lodash/debounce'
import { colors, useICColorMode } from 'styles/colors'

import { Box, Flex, useDisclosure } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import {
  getExchangeIssuanceLeveragedContractAddress,
  getExchangeIssuanceZeroExContractAddress,
} from '@indexcoop/flash-mint-sdk'

import FlashbotsRpcMessage from 'components/header/FlashbotsRpcMessage'
import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import { FlashMintPerp } from 'constants/ethContractAddresses'
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
import { useProtection } from 'providers/Protection'
import { useSlippage } from 'providers/Slippage'
import { isValidTokenInput, toWei } from 'utils'
import { getBlockExplorerContractUrl } from 'utils/blockExplorer'
import { isNotTradableToken } from 'utils/tokens'

import { ContractExecutionView } from './ContractExecutionView'
import DirectIssuance from './DirectIssuance'
import { ProtectionWarning } from './ProtectionWarning'
import { QuickTradeProps } from './QuickTrade'
import {
  formattedBalance,
  getHasInsufficientFunds,
} from './QuickTradeFormatter'
import { getSelectTokenListItems, SelectTokenModal } from './SelectTokenModal'
import { TradeButton } from './TradeButton'

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
  } = useTradeTokenLists(chainId, props.singleToken)
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

    if (!isApproved()) {
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

type TradeButtonContainerProps = {
  indexToken: Token
  inputOutputToken: Token
  buttonLabel: string
  isButtonDisabled: boolean
  isLoading: boolean
  onClickTradeButton: () => void
  contractAddress: string | null
  contractExplorerUrl: string | null
}

const TradeButtonContainer = ({
  indexToken,
  inputOutputToken,
  buttonLabel,
  isButtonDisabled,
  isLoading,
  onClickTradeButton,
  contractAddress,
  contractExplorerUrl,
}: TradeButtonContainerProps) => {
  const { isDarkMode } = useICColorMode()
  const { isMainnet } = useNetwork()
  const protection = useProtection()

  // Does user need protecting from productive assets?
  const [requiresProtection, setRequiresProtection] = useState(false)
  useEffect(() => {
    if (
      protection.isProtectable &&
      (indexToken.isDangerous || inputOutputToken.isDangerous)
    ) {
      setRequiresProtection(true)
    } else {
      setRequiresProtection(false)
    }
  }, [indexToken, inputOutputToken, protection])

  return (
    <Flex direction='column'>
      {requiresProtection && <ProtectionWarning isDarkMode={isDarkMode} />}
      <Flex my='8px'>{isMainnet && <FlashbotsRpcMessage />}</Flex>
      {!requiresProtection && (
        <TradeButton
          label={buttonLabel}
          background={isDarkMode ? colors.icWhite : colors.icBlue}
          isDisabled={isButtonDisabled}
          isLoading={isLoading}
          onClick={onClickTradeButton}
        />
      )}
      {contractAddress && contractExplorerUrl && (
        <ContractExecutionView
          blockExplorerUrl={contractExplorerUrl}
          contractAddress={contractAddress}
          name=''
        />
      )}
    </Flex>
  )
}

export default FlashMint
