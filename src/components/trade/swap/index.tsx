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
import { useTokenlists } from '@/lib/hooks/use-tokenlists'
import { useTradeButton } from './hooks/use-trade-button'
import { useWallet } from '@/lib/hooks/useWallet'
import { useProtection } from '@/lib/providers/protection'
import { useSelectedToken } from '@/lib/providers/selected-token-provider'
import { useSlippage } from '@/lib/providers/slippage'
import { isValidTokenInput, toWei } from '@/lib/utils'
import { getZeroExRouterAddress } from '@/lib/utils/contracts'
import { getNativeToken, getTokenBySymbol } from '@/lib/utils/tokens'

import { getFormattedPriceImpact } from '../_shared/QuickTradeFormatter'

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

export const Swap = () => {
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
    isFetchingZeroEx,
    isFetchingMoreOptions,
    fetchAndCompareOptions,
    quoteResult,
    quoteResultOptions,
  } = useBestQuote()

  const [isBuying, setIsBuying] = useState(true)

  // TODO: ?
  const [inputTokenAmountFormatted, setInputTokenAmountFormatted] = useState('')
  const [sellTokenAmount, setSellTokenAmount] = useState('0')

  const hasFetchingError = quoteResult.error !== null && !isFetchingZeroEx

  const { inputToken, outputToken, selectInputToken, selectOutputToken } =
    useSelectedToken()
  const { inputTokenslist, outputTokenslist } = useTokenlists(
    isBuying,
    inputToken,
    outputToken
  )

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
  } = useSwap(
    inputToken,
    outputToken,
    sellTokenAmount,
    quoteResult?.quotes.zeroEx
  )

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
  } = useApproval(inputToken, zeroExAddress, inputTokenAmountWei)

  const shouldApprove = useMemo(() => {
    const nativeToken = getNativeToken(chainId)
    const isNativeToken = nativeToken?.symbol === inputToken.symbol
    return !isNativeToken
  }, [chainId, inputToken])

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
      inputToken,
      sellTokenAmount,
      inputTokenPrice,
      outputToken,
      outputTokenPrice,
      // TODO:
      // nativeTokenPrice,
      0,
      isBuying,
      slippage
    )
  }, [
    isBuying,
    outputToken,
    inputTokenPrice,
    outputTokenPrice,
    requiresProtection,
    inputToken,
    sellTokenAmount,
    slippage,
  ])

  useEffect(() => {
    fetchOptions()
  }, [fetchOptions])

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
  }, [buttonState, executeTrade, fetchOptions, isApprovedForSwap, onApproveForSwap, openConnectModal, quoteResult.quotes.zeroEx, shouldApprove])

  const onSwitchTokens = useCallback(() => {
    const currentInputToken = inputToken
    const currentOutputToken = outputToken
    selectInputToken(currentOutputToken)
    selectOutputToken(currentInputToken)
    setIsBuying(!isBuying)
    resetTradeData()
  }, [inputToken, outputToken])

  return (
    <Flex
      background='linear-gradient(33deg, rgba(0, 189, 192, 0.05) -9.23%, rgba(0, 249, 228, 0.05) 48.82%, rgba(212, 0, 216, 0.05) 131.54%), linear-gradient(187deg, #FCFFFF -184.07%, #F7F8F8 171.05%)'
      border='1px solid'
      borderColor={colors.icGray1}
      borderRadius='24px'
      boxShadow='0.5px 1px 2px 0px rgba(44, 51, 51, 0.25), 2px 2px 1px 0px #FCFFFF inset'
      direction='column'
      p='8px 16px 16px'
      height={'100%'}
    >
      <Text
        color={colors.icGray4}
        fontSize={'md'}
        fontWeight={500}
        ml={'12px'}
        my={'16px'}
      >
        Swap
      </Text>
      <Flex direction='column' m='4px 0 6px'>
        <TradeInputSelector
          config={{ isReadOnly: false }}
          balance={inputTokenBalanceFormatted}
          caption='You pay'
          formattedFiat={inputTokenAmountUsd}
          selectedToken={inputToken}
          selectedTokenAmount={inputTokenAmountFormatted}
          onChangeInput={onChangeInputTokenAmount}
          onClickBalance={onClickInputBalance}
          onSelectToken={() => {
            if (inputTokenslist.length > 1) onOpenSelectInputToken()
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
          selectedToken={outputToken}
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
            if (outputTokenslist.length > 1) onOpenSelectOutputToken()
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
          selectInputToken(getTokenBySymbol(tokenSymbol)!)
          onCloseSelectInputToken()
        }}
        address={address}
        tokens={inputTokenslist}
      />
      <SelectTokenModal
        isOpen={isSelectOutputTokenOpen}
        onClose={onCloseSelectOutputToken}
        onSelectedToken={(tokenSymbol) => {
          selectOutputToken(getTokenBySymbol(tokenSymbol)!)
          onCloseSelectOutputToken()
        }}
        address={address}
        tokens={outputTokenslist}
      />
    </Flex>
  )
}
