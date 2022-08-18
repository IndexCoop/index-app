import { useEffect, useState } from 'react'

import debounce from 'lodash/debounce'
import { colors, useICColorMode } from 'styles/colors'
import { useNetwork } from 'wagmi'

import { Box, Flex, useDisclosure } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import {
  getExchangeIssuanceLeveragedContractAddress,
  getExchangeIssuanceZeroExContractAddress,
} from '@indexcoop/flash-mint-sdk'

import FlashbotsRpcMessage from 'components/header/FlashbotsRpcMessage'
import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import {
  FlashMintPerp,
  zeroExRouterOptimismAddress,
} from 'constants/ethContractAddresses'
import { Token, USDC } from 'constants/tokens'
import { useIssuance } from 'hooks/issuance/useIssuance'
import { useIssuanceQuote } from 'hooks/issuance/useIssuanceQuote'
import { useApproval } from 'hooks/useApproval'
import { useBalances } from 'hooks/useBalance'
import { useIsSupportedNetwork } from 'hooks/useIsSupportedNetwork'
import { useTradeTokenLists } from 'hooks/useTradeTokenLists'
import { useWallet } from 'hooks/useWallet'
import { useProtection } from 'providers/Protection'
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

export enum QuickTradeBestOption {
  zeroEx,
  exchangeIssuance,
  leveragedExchangeIssuance,
}

const FlashMint = (props: QuickTradeProps) => {
  const { address } = useWallet()
  const { chain } = useNetwork()
  const chainId = chain?.id
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

  const protection = useProtection()

  const supportedNetwork = useIsSupportedNetwork(chainId ?? -1)

  const {
    buyToken: indexToken,
    buyTokenList: indexTokenList,
    sellToken: inputOutputToken,
    sellTokenList: inputOutputTokenList,
    changeBuyToken: changeIndexToken,
    changeSellToken: changeInputOutputToken,
  } = useTradeTokenLists(chainId, props.singleToken)
  const { getBalance } = useBalances()

  const [bestOption, setBestOption] = useState<QuickTradeBestOption | null>(
    null
  )
  const [indexTokenAmountFormatted, setIndexTokenAmountFormatted] =
    useState('0.0')
  const [indexTokenAmount, setIndexTokenAmount] = useState('0')
  const [isMinting, setIsMinting] = useState(true)

  const spenderAddress0x = getExchangeIssuanceZeroExContractAddress(chain?.id)
  const spenderAddressLevEIL = getExchangeIssuanceLeveragedContractAddress(
    chain?.id
  )

  const indexTokenAmountWei = toWei(indexTokenAmount, indexToken.decimals)

  const { estimatedUSDC, getQuote } = useIssuanceQuote(
    isMinting,
    indexToken,
    indexTokenAmountWei
  )

  const {
    isApproved: isAppovedForUSDC,
    isApproving: isApprovingForUSDC,
    onApprove: onApproveForUSDC,
    // TODO: change contract based on token
  } = useApproval(inputOutputToken, FlashMintPerp, estimatedUSDC)

  const {
    isApproved: isApprovedForMnye,
    isApproving: isApprovingForMnye,
    onApprove: onApproveForMnye,
    // TODO: change contract based on token
  } = useApproval(indexToken, FlashMintPerp, indexTokenAmountWei)

  const { handleTrade, isTrading } = useIssuance(
    isMinting,
    indexToken,
    indexTokenAmountWei,
    estimatedUSDC
  )

  const hasInsufficientFundsInputOutputToken = getHasInsufficientFunds(
    false,
    BigNumber.from(estimatedUSDC),
    getBalance(USDC.symbol)
  )

  const hasInsufficientFundsIndexToken = getHasInsufficientFunds(
    false,
    indexTokenAmountWei,
    getBalance(indexToken.symbol)
  )

  const getContractForBestOption = (
    bestOption: QuickTradeBestOption | null
  ): string => {
    switch (bestOption) {
      case QuickTradeBestOption.exchangeIssuance:
        return spenderAddress0x
      case QuickTradeBestOption.leveragedExchangeIssuance:
        return spenderAddressLevEIL
      default:
        return zeroExRouterOptimismAddress
    }
  }
  const contractBestOption = getContractForBestOption(bestOption)
  const contractBlockExplorerUrl = getBlockExplorerContractUrl(
    contractBestOption,
    chain?.id
  )

  const resetTradeData = () => {
    setBestOption(null)
    setIndexTokenAmountFormatted('0.0')
  }

  /**
   * Issuance Contract
   */
  const getEstimatedBalance = () => {
    getQuote()
  }

  useEffect(() => {
    getEstimatedBalance()
  }, [indexTokenAmount, isMinting])

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

  const getIsApproved = () => {
    if (isMinting) return isAppovedForUSDC
    return isApprovedForMnye
  }

  const getIsApproving = () => {
    if (isMinting) return isApprovingForUSDC
    return isApprovingForMnye
  }

  const getOnApprove = () => {
    if (isMinting) return onApproveForUSDC()
    return onApproveForMnye()
  }

  /**
   * Get the correct trade button label according to different states
   * @returns string label for trade button
   */
  const getTradeButtonLabel = () => {
    if (!address) return 'Connect Wallet'
    if (!supportedNetwork) return 'Wrong Network'

    if (isNotTradableToken(props.singleToken, chainId)) {
      let chainName = 'this Network'
      switch (chain?.id) {
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

    if (getIsApproving()) {
      return 'Approving...'
    }

    if (!getIsApproved()) {
      return 'Approve Tokens'
    }
    if (isTrading) {
      return 'Trading...'
    }

    return 'Trade'
  }

  const onChangeIndexTokenAmount = debounce((token: Token, input: string) => {
    if (input === '') {
      resetTradeData()
      return
    }
    if (!isValidTokenInput(input, token.decimals)) return
    setIndexTokenAmount(input || '0')
  }, 1000)

  const onClickTradeButton = async () => {
    if (!address) return

    if (isMinting && hasInsufficientFundsInputOutputToken) return
    if (!isMinting && hasInsufficientFundsIndexToken) return

    if (!getIsApproved()) {
      await getOnApprove()
      return
    }
    await handleTrade()
  }

  const getButtonDisabledState = () => {
    if (!supportedNetwork) return true
    if (!address) return true
    return (
      indexTokenAmount === '0' ||
      (isMinting && hasInsufficientFundsInputOutputToken) ||
      (!isMinting && hasInsufficientFundsIndexToken) ||
      isTrading ||
      isNotTradableToken(props.singleToken, chainId)
    )
  }

  const buttonLabel = getTradeButtonLabel()
  const isButtonDisabled = getButtonDisabledState()
  const isLoading = getIsApproving()

  const isNarrow = props.isNarrowVersion ?? false

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

  const formattedBalanceIndexToken = formattedBalance(USDC, estimatedUSDC)
  const formattedBalanceInputOutputToken = formattedBalance(
    USDC,
    getBalance(USDC.symbol)
  )

  return (
    <Box mt='32px'>
      <DirectIssuance
        indexToken={indexToken}
        indexTokenList={indexTokenList}
        indexTokenAmountFormatted={indexTokenAmountFormatted}
        inputOutputToken={inputOutputToken}
        formattedBalance={formattedBalanceIndexToken}
        formattedBalanceInputOutputToken={formattedBalanceInputOutputToken}
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
      <Flex direction='column'>
        {requiresProtection && <ProtectionWarning isDarkMode={isDarkMode} />}
        <Flex my='8px'>{chain?.id === 1 && <FlashbotsRpcMessage />}</Flex>
        {!requiresProtection && (
          <TradeButton
            label={buttonLabel}
            background={isDarkMode ? colors.icWhite : colors.icBlue}
            isDisabled={isButtonDisabled}
            isLoading={isLoading}
            onClick={onClickTradeButton}
          />
        )}
        {bestOption !== null && (
          <ContractExecutionView
            blockExplorerUrl={contractBlockExplorerUrl}
            contractAddress={contractBestOption}
            name=''
          />
        )}
      </Flex>
      <SelectTokenModal
        isOpen={isInputOutputTokenModalOpen}
        onClose={onCloseInputOutputTokenModal}
        onSelectedToken={(tokenSymbol) => {
          // TODO: fetch quote
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

export default FlashMint
