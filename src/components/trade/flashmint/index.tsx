import { useCallback, useEffect, useState } from 'react'

import { Box, useDisclosure } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { LeveragedRethStakingYield, Token } from '@/constants/tokens'
import { useApproval } from '@/lib/hooks/useApproval'
import { useFlashMintQuote } from '@/lib/hooks/useFlashMintQuote'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useTradeTokenLists } from '@/lib/hooks/useTradeTokenLists'
import { useWallet } from '@/lib/hooks/useWallet'
import { useBalanceData } from '@/lib/providers/Balances'
import { useSlippage } from '@/lib/providers/slippage'
import { displayFromWei, isValidTokenInput, toWei } from '@/lib/utils'
import { getBlockExplorerContractUrl } from '@/lib/utils/blockExplorer'
import {
  getContractForQuote,
  getQuoteAmount,
} from '@/lib/utils/flashMint/quotes'
import { selectSlippage } from '@/lib/utils/slippage'
import { getNativeToken } from '@/lib/utils/tokens'

import { TradeButtonContainer } from '../_shared/footer'
import {
  formattedBalance,
  formattedFiat,
  getHasInsufficientFunds,
} from '../_shared/QuickTradeFormatter'
import { SelectTokenModal } from '@/components/trade/swap/components/select-token-modal'
import { TransactionReview } from '@/components/trade/swap/components/transaction-review/types'
import { TransactionReviewModal } from '@/components/trade/swap/components/transaction-review/'
import { QuickTradeProps } from '../swap'

import DirectIssuance from './DirectIssuance'
import { useRethSupply } from '@/components/supply/useRethSupply'
import { SupplyCapState } from '@/components/supply'

const FlashMint = (props: QuickTradeProps) => {
  const { onOverrideSupplyCap, onShowSupplyCap } = props
  const { openConnectModal } = useConnectModal()
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
  } = useTradeTokenLists(true)
  const { isLoading: isLoadingBalance, getTokenBalance } = useBalanceData()
  const { data: rethSupplyData } = useRethSupply(
    indexToken.symbol === LeveragedRethStakingYield.symbol
  )
  const { slippage } = useSlippage()

  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [buttonLabel, setButtonLabel] = useState('')
  const [contractAddress, setContractAddress] = useState<string | null>(null)
  const [indexTokenAmountFormatted, setIndexTokenAmountFormatted] = useState('')
  const [inputOutputTokenAmount, setInputOutputTokenAmount] = useState(
    BigNumber.from(0)
  )
  const [indexTokenAmount, setIndexTokenAmount] = useState('0')
  const [isMinting, setIsMinting] = useState(true)
  const [indexTokenBalanceFormatted, setIndexTokenBalanceFormatted] =
    useState('0.0')
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

  useEffect(() => {
    if (!onShowSupplyCap) return
    const show =
      indexToken.symbol === LeveragedRethStakingYield.symbol && isMinting
    onShowSupplyCap(show)
  }, [indexToken, isMinting, onShowSupplyCap])

  useEffect(() => {
    if (!onOverrideSupplyCap) return
    const isMintingIcReth =
      indexToken.symbol === LeveragedRethStakingYield.symbol && isMinting
    if (isFetchingQuote || !rethSupplyData || !isMintingIcReth) {
      onOverrideSupplyCap(undefined)
      return
    }
    const indexAmountBn = indexTokenAmountWei
    const indexAmount = Number(displayFromWei(indexAmountBn))
    const willExceedCap = indexAmount > rethSupplyData.available
    const totalSupplyPercent = 100 + 5
    if (willExceedCap) {
      onOverrideSupplyCap({
        state: SupplyCapState.capWillExceed,
        totalSupply: '',
        totalSupplyPercent,
      })
      setButtonDisabled(true)
    } else {
      onOverrideSupplyCap(undefined)
      setButtonDisabled(false)
    }
  }, [
    chainId,
    indexToken,
    isFetchingQuote,
    isMinting,
    onOverrideSupplyCap,
    quoteResult,
    rethSupplyData,
  ])

  const approve = () => {
    if (isMinting) return approveInputOutputToken()
    return approveIndexToken()
  }

  const isApproved = () => {
    if (isMinting) {
      const isNativeCurrency =
        inputOutputToken.symbol === (getNativeToken(chainId)?.symbol ?? '')
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
    if (buttonDisabled) return true
    if (
      rethSupplyData &&
      indexToken.symbol === LeveragedRethStakingYield.symbol &&
      isMinting &&
      rethSupplyData.state === SupplyCapState.capReached
    ) {
      return true
    }
    return (
      indexTokenAmount === '0' ||
      (isMinting && hasInsufficientFundsInputOutputToken) ||
      (!isMinting && hasInsufficientFundsIndexToken)
    )
  }

  /**
   * Get the correct trade button label according to different states
   * @returns string label for trade button
   */
  useEffect(() => {
    const label = () => {
      if (!address) return 'Connect Wallet'
      if (!isSupportedNetwork) return 'Wrong Network'

      if (indexTokenAmount === '0') {
        return 'Enter an amount'
      }

      if (isMinting && hasInsufficientFundsInputOutputToken) {
        return 'Insufficient funds'
      }

      if (!isMinting && hasInsufficientFundsIndexToken) {
        return 'Insufficient funds'
      }

      if (
        rethSupplyData &&
        indexToken.symbol === LeveragedRethStakingYield.symbol &&
        isMinting
      ) {
        if (rethSupplyData.state === SupplyCapState.capReached) {
          return 'Review supply cap'
        }

        if (buttonDisabled) {
          return 'Adjust amount'
        }
      }

      if (isApproving()) {
        return 'Approving...'
      }

      if (!isApproved()) {
        return 'Approve Token'
      }

      return 'Review Transaction'
    }
    setButtonLabel(label())
  }, [
    address,
    isApproved,
    isApproving,
    isMinting,
    hasInsufficientFundsIndexToken,
    hasInsufficientFundsInputOutputToken,
    indexToken,
    indexTokenAmount,
    chainId,
    isSupportedNetwork,
    rethSupplyData,
  ])

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

  const onChangeIndexTokenAmount = (token: Token, input: string) => {
    if (input === '') {
      resetData()
    }
    setIndexTokenAmountFormatted(input)
    if (!isValidTokenInput(input, token.decimals)) return
    setIndexTokenAmount(input || '')
  }

  const onClickTradeButton = async () => {
    if (!address && openConnectModal) {
      openConnectModal()
      return
    }
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

  // DirectIssuance
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
    // To avoid rounding errors that could show a wrong fiat price, no `decimals`
    // should be set here.
    parseFloat(
      displayFromWei(
        inputOutputTokenAmount,
        undefined,
        inputOutputToken.decimals
      ) ?? '0'
    ),
    inputOutputPrice
  )

  // TradeButtonContainer
  const isButtonDisabled = getTradeButtonDisabledState()
  const isLoading = isApproving() || isFetchingQuote
  const contractBlockExplorerUrl =
    contractAddress === null
      ? null
      : getBlockExplorerContractUrl(contractAddress, chainId)

  const onClickBalance = () => {
    if (!indexTokenBalanceFormatted) return
    const fullTokenBalance = formatUnits(
      getTokenBalance(indexToken.symbol, chainId) ?? '0.0',
      indexToken.decimals
    )
    setIndexTokenAmountFormatted(fullTokenBalance)
    setIndexTokenAmount(fullTokenBalance)
  }

  useEffect(() => {
    if (isLoadingBalance) return
    const tokenBal = getTokenBalance(indexToken.symbol, chainId)
    setIndexTokenBalanceFormatted(formattedBalance(indexToken, tokenBal))
  }, [getTokenBalance, indexToken, isLoadingBalance])

  return (
    <Box mt='8px'>
      <DirectIssuance
        indexToken={indexToken}
        indexTokenAmountFormatted={indexTokenAmountFormatted}
        indexTokenBalanceFormatted={indexTokenBalanceFormatted}
        indexTokenFiatFormatted={indexTokenFiatFormatted}
        inputOutputToken={inputOutputToken}
        inputOutputTokenAmountFormatted={inputOutputTokenAmountFormatted}
        inputOutputTokenBalanceFormatted={inputOutputTokenBalanceFormatted}
        inputOutputTokenFiatFormatted={inputOutputTokenFiatFormatted}
        isIssue={isMinting}
        isMintable={true}
        onChangeBuyTokenAmount={onChangeIndexTokenAmount}
        onClickBalance={onClickBalance}
        onSelectIndexToken={() => {
          if (indexTokenList.length > 1) onOpenIndexTokenModal()
        }}
        onSelectInputOutputToken={() => {
          if (inputOutputTokenList.length > 1) onOpenInputOutputTokenModal()
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
        address={address}
        tokens={inputOutputTokenList}
      />
      <SelectTokenModal
        isOpen={isIndexTokenModalOpen}
        onClose={onCloseIndexTokenModal}
        onSelectedToken={(tokenSymbol) => {
          changeIndexToken(tokenSymbol)
          onCloseIndexTokenModal()
        }}
        address={address}
        tokens={indexTokenList}
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
