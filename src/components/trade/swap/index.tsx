import { useCallback, useEffect, useMemo, useState } from 'react'

import { colors, useICColorMode } from '@/lib/styles/colors'

import { UpDownIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { TradeButton } from '@/components/trade-button'
import { Token } from '@/constants/tokens'
import { useApproval } from '@/lib/hooks/useApproval'
import { useBestQuote } from '@/lib/hooks/useBestQuote'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useTrade } from '@/lib/hooks/useTrade'
import { useTradeTokenLists } from '@/lib/hooks/useTradeTokenLists'
import { useProtection } from '@/lib/providers/protection'
import { useSlippage } from '@/lib/providers/slippage'
import { isValidTokenInput, toWei } from '@/lib/utils'
import { getZeroExRouterAddress } from '@/lib/utils/contracts'
import { getNativeToken } from '@/lib/utils/tokens'

import { getFormattedPriceImpact } from '../_shared/QuickTradeFormatter'

import { BetterQuoteState, BetterQuoteView } from './components/BetterQuoteView'
import { ProtectionWarning } from './components/protection-warning'
import { SelectTokenModal } from './components/select-token-modal'
import { RethSupplyCapOverrides } from '@/components/supply'
import { TradeDetails } from './components/trade-details'
import { TradeInputSelector } from './components/trade-input-selector'
import { useSwap } from './hooks/use-swap'
import {
  TradeButtonState,
  useTradeButtonState,
} from './hooks/use-trade-button-state'
import { useTradeButton } from './hooks/use-trade-button'
import { useWallet } from '@/lib/hooks/useWallet'

// TODO: remove with new navigation
export type QuickTradeProps = {
  onOverrideSupplyCap?: (overrides: RethSupplyCapOverrides | undefined) => void
  onShowSupplyCap?: (show: boolean) => void
  switchTabs?: () => void
}

export const Swap = (props: QuickTradeProps) => {
  const { openConnectModal } = useConnectModal()
  const { isDarkMode } = useICColorMode()
  const requiresProtection = useProtection()
  const { chainId } = useNetwork()
  const { slippage } = useSlippage()
  const { executeTrade, isTransacting } = useTrade()
  const { address } = useWallet()

  const {
    isOpen: isSelectInputTokenOpen,
    onOpen: onOpenSelectInputToken,
    onClose: onCloseSelectInputToken,
  } = useDisclosure()
  const {
    isOpen: isSelectOutputTokenOpen,
    onOpen: onOpenSelectOutputToken,
    onClose: onCloseSelectOutputToken,
  } = useDisclosure()

  const {
    isBuying,
    buyToken,
    buyTokenList,
    nativeTokenPrice,
    sellToken,
    sellTokenList,
    changeBuyToken,
    changeSellToken,
    swapTokenLists,
  } = useTradeTokenLists()

  const {
    isFetchingZeroEx,
    isFetchingMoreOptions,
    fetchAndCompareOptions,
    quoteResult,
    quoteResultOptions,
  } = useBestQuote()

  // TODO: ?
  const [inputTokenAmountFormatted, setInputTokenAmountFormatted] = useState('')
  const [sellTokenAmount, setSellTokenAmount] = useState('0')

  const hasFetchingError = quoteResult.error !== null && !isFetchingZeroEx

  const {
    hasInsufficientFunds,
    gasCostsUsd,
    inputTokenAmountUsd,
    inputTokenAmountWei,
    inputTokenBalance,
    inputTokenBalanceFormatted,
    inputTokenPrice,
    outputTokenAmountFormatted,
    outputTokenAmountUsd,
    outputTokenBalanceFormatted,
    outputTokenPrice,
    showWarning,
    tokenPrices,
    tradeData,
  } = useSwap(sellToken, buyToken, sellTokenAmount, quoteResult?.quotes.zeroEx)

  const priceImpact = isFetchingZeroEx
    ? null
    : getFormattedPriceImpact(
        parseFloat(sellTokenAmount),
        inputTokenPrice,
        parseFloat(outputTokenAmountFormatted),
        outputTokenPrice,
        isDarkMode
      )

  const zeroExAddress = useMemo(
    () => getZeroExRouterAddress(chainId),
    [chainId]
  )
  const {
    isApproved: isApprovedForSwap,
    isApproving: isApprovingForSwap,
    approve: onApproveForSwap,
  } = useApproval(sellToken, zeroExAddress, inputTokenAmountWei)

  const shouldApprove = useMemo(() => {
    const nativeToken = getNativeToken(chainId)
    const isNativeToken = nativeToken?.symbol === sellToken.symbol
    return !isNativeToken
  }, [chainId, sellToken])

  const buttonState = useTradeButtonState(
    hasFetchingError,
    hasInsufficientFunds,
    shouldApprove,
    isApprovedForSwap,
    isApprovingForSwap,
    isTransacting,
    sellTokenAmount
  )
  const { buttonLabel, isDisabled } = useTradeButton(buttonState)

  const resetTradeData = () => {
    setInputTokenAmountFormatted('')
    setSellTokenAmount('0')
  }

  useEffect(() => {
    resetTradeData()
  }, [chainId])

  const fetchOptions = useCallback(() => {
    if (requiresProtection) return
    fetchAndCompareOptions(
      sellToken,
      sellTokenAmount,
      inputTokenPrice,
      buyToken,
      outputTokenPrice,
      nativeTokenPrice,
      isBuying,
      slippage
    )
  }, [
    isBuying,
    buyToken,
    inputTokenPrice,
    nativeTokenPrice,
    outputTokenPrice,
    requiresProtection,
    sellToken,
    sellTokenAmount,
    slippage,
  ])

  useEffect(() => {
    fetchOptions()
  }, [fetchOptions])

  // Delete: with better quote view
  const onClickBetterQuote = () => {
    if (!quoteResultOptions.hasBetterQuote) return
    if (props.switchTabs) {
      props.switchTabs()
    }
  }

  const onChangeInputTokenAmount = (token: Token, input: string) => {
    if (input === '') {
      resetTradeData()
    }
    setInputTokenAmountFormatted(input || '')
    if (!isValidTokenInput(input, token.decimals)) return
    setSellTokenAmount(input || '')
  }

  const onClickInputBalance = useCallback(() => {
    if (!inputTokenBalance) return
    setInputTokenAmountFormatted(inputTokenBalance)
    setSellTokenAmount(inputTokenBalance)
  }, [inputTokenBalance])

  const onClickTradeButton = useCallback(async () => {
    if (buttonState === TradeButtonState.connectWallet) {
      if (openConnectModal) {
        openConnectModal()
      }
      return
    }

    if (buttonState === TradeButtonState.fetchingError) {
      fetchOptions()
      return
    }

    if (buttonState === TradeButtonState.insufficientFunds) return

    if (!isApprovedForSwap && shouldApprove) {
      await onApproveForSwap()
      return
    }

    if (buttonState === TradeButtonState.default) {
      await executeTrade(quoteResult.quotes.zeroEx)
    }
  }, [buttonState])

  const onSwitchTokens = () => {
    swapTokenLists()
    resetTradeData()
  }

  // Delete: when removing better quote view
  const betterQuoteState = useMemo(() => {
    if (isFetchingMoreOptions) {
      return BetterQuoteState.fetchingQuote
    }

    if (quoteResultOptions.hasBetterQuote) {
      return quoteResultOptions.isReasonPriceImpact
        ? BetterQuoteState.betterQuotePriceImpact
        : BetterQuoteState.betterQuote
    }

    return BetterQuoteState.noBetterQuote
  }, [
    isFetchingMoreOptions,
    quoteResultOptions.hasBetterQuote,
    quoteResultOptions.isReasonPriceImpact,
  ])

  return (
    <Box>
      <Flex direction='column' m='4px 0 6px'>
        <TradeInputSelector
          config={{ isReadOnly: false }}
          balance={inputTokenBalanceFormatted}
          caption='You pay'
          formattedFiat={inputTokenAmountUsd}
          selectedToken={sellToken}
          selectedTokenAmount={inputTokenAmountFormatted}
          onChangeInput={onChangeInputTokenAmount}
          onClickBalance={onClickInputBalance}
          onSelectToken={() => {
            if (sellTokenList.length > 1) onOpenSelectInputToken()
          }}
        />
        <Box h='6px' alignSelf={'center'}>
          <IconButton
            background={colors.icWhite}
            margin={'-16px 0 0 0'}
            aria-label='switch input/output tokens'
            color={colors.icGray2}
            icon={<UpDownIcon />}
            onClick={onSwitchTokens}
          />
        </Box>
        <TradeInputSelector
          config={{
            isInputDisabled: true,
            isSelectorDisabled: false,
            isReadOnly: true,
          }}
          caption={'You receive'}
          selectedToken={buyToken}
          selectedTokenAmount={outputTokenAmountFormatted}
          balance={outputTokenBalanceFormatted}
          formattedFiat={outputTokenAmountUsd}
          priceImpact={
            priceImpact
              ? {
                  value: priceImpact.priceImpact,
                  colorCoding: priceImpact.colorCoding,
                }
              : undefined
          }
          onSelectToken={() => {
            if (buyTokenList.length > 1) onOpenSelectOutputToken()
          }}
        />
      </Flex>
      <>
        {tradeData.length > 0 && (
          <TradeDetails
            data={tradeData}
            gasPriceInUsd={gasCostsUsd}
            prices={tokenPrices}
            showWarning={showWarning}
          />
        )}
        {tradeData.length > 0 && (
          <Box my='16px'>
            <BetterQuoteView
              onClick={onClickBetterQuote}
              state={betterQuoteState}
              savingsUsd={quoteResultOptions.savingsUsd}
            />
          </Box>
        )}
        {hasFetchingError && (
          <Text align='center' color={colors.icRed} p='16px'>
            {quoteResult.error?.message ?? 'Error fetching quote'}
          </Text>
        )}
        {requiresProtection && <ProtectionWarning isDarkMode={isDarkMode} />}
        {!requiresProtection && (
          <TradeButton
            label={buttonLabel}
            isDisabled={isDisabled}
            isLoading={isApprovingForSwap || isFetchingZeroEx}
            onClick={onClickTradeButton}
          />
        )}
      </>
      <SelectTokenModal
        isOpen={isSelectInputTokenOpen}
        onClose={onCloseSelectInputToken}
        onSelectedToken={(tokenSymbol) => {
          changeSellToken(tokenSymbol)
          onCloseSelectInputToken()
        }}
        address={address}
        tokens={sellTokenList}
      />
      <SelectTokenModal
        isOpen={isSelectOutputTokenOpen}
        onClose={onCloseSelectOutputToken}
        onSelectedToken={(tokenSymbol) => {
          changeBuyToken(tokenSymbol)
          onCloseSelectOutputToken()
        }}
        address={address}
        tokens={buyTokenList}
      />
    </Box>
  )
}
