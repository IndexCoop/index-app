import { useCallback, useState } from 'react'

import { Signer } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'

import { useBalances } from 'hooks/useBalance'
import { FlashMintNotionalQuote } from 'hooks/useBestQuote'
import { useNetwork } from 'hooks/useNetwork'
import { useWallet } from 'hooks/useWallet'
import { fromWei } from 'utils'
import { logTx } from 'utils/api/analytics'
import {
  CaptureExchangeIssuanceFunctionKey,
  CaptureExchangeIssuanceKey,
  captureTransaction,
} from 'utils/api/sentry'
import { getAddressForToken } from 'utils/tokens'

import { getFlashMintNotionalContract } from './fmNotionalContract'
import {
  FlashMintNotionalGasEstimateFailedError,
  getFlashMintNotionalGasEstimate,
} from './fmNotionalGasEstimate'

export const useTradeFlashMintNotional = () => {
  const { address, provider, signer } = useWallet()
  const { chainId } = useNetwork()
  const { getBalance } = useBalances()

  const [isTransacting, setIsTransacting] = useState(false)
  const [txWouldFail, setTxWouldFail] = useState(false)

  const executeFlashMintNotionalTrade = useCallback(
    async (
      quote: FlashMintNotionalQuote | null,
      slippage: number,
      override: boolean = false
    ) => {
      if (!address || !chainId || !quote) return

      const isMinting = quote.isMinting
      const inputToken = quote.inputToken
      const outputToken = quote.outputToken
      const indexTokenAmount = quote.indexTokenAmount
      const inputOutputTokenAmount = quote.inputOutputTokenAmount
      const swapData = quote.swapData

      const inputTokenAddress = getAddressForToken(inputToken, chainId)
      const outputTokenAddress = getAddressForToken(outputToken, chainId)
      if (!outputTokenAddress || !inputTokenAddress) return

      let requiredBalance = fromWei(inputOutputTokenAmount, inputToken.decimals)
      const spendingTokenBalance =
        getBalance(inputToken.symbol) || BigNumber.from(0)
      if (spendingTokenBalance.lt(requiredBalance)) return

      const contract = getFlashMintNotionalContract(signer as Signer, chainId)
      const fixedTokenAddress = isMinting
        ? outputTokenAddress
        : inputTokenAddress
      const issuanceModule = '0xa0a98EB7Af028BE00d04e46e1316808A62a8fd59'
      const isDebtIssuance = true
      const redeemMaturedPositions = false

      try {
        setIsTransacting(true)

        // Will throw error if tx would fail
        // If the user overrides, we take any gas estimate
        const canFail = override
        const gasLimit = await getFlashMintNotionalGasEstimate(
          isMinting,
          inputToken,
          outputToken,
          indexTokenAmount,
          inputOutputTokenAmount,
          swapData,
          slippage,
          chainId,
          provider,
          canFail
        )

        if (isMinting) {
          const maxAmountInputToken = inputOutputTokenAmount
          console.log('---')
          console.log(fixedTokenAddress)
          console.log(inputToken.address)
          console.log(indexTokenAmount.toString())
          console.log(indexTokenAmount.mul(99).div(100).toString())
          console.log(swapData)
          console.log(issuanceModule)
          console.log(isDebtIssuance)
          console.log(slippage.toString())
          console.log(redeemMaturedPositions)
          captureTransaction({
            exchangeIssuance: CaptureExchangeIssuanceKey.notional,
            function: CaptureExchangeIssuanceFunctionKey.issueErc20,
            setToken: outputTokenAddress,
            setAmount: indexTokenAmount.toString(),
            gasLimit: gasLimit.toString(),
            slippage: slippage.toString(),
          })
          const mintTx = await contract.issueExactSetFromToken(
            fixedTokenAddress,
            inputToken.address,
            indexTokenAmount,
            maxAmountInputToken,
            swapData,
            issuanceModule,
            isDebtIssuance,
            slippage,
            redeemMaturedPositions,
            { gasLimit }
          )
          logTx(chainId ?? -1, 'FlashMintNotional', mintTx)
        } else {
          captureTransaction({
            exchangeIssuance: CaptureExchangeIssuanceKey.notional,
            function: CaptureExchangeIssuanceFunctionKey.redeemErc20,
            setToken: outputTokenAddress,
            setAmount: indexTokenAmount.toString(),
            gasLimit: gasLimit.toString(),
            slippage: slippage.toString(),
          })
          const minAmountOutputToken = inputOutputTokenAmount
          const redeemTx = await contract.redeemExactSetForToken(
            fixedTokenAddress,
            outputToken.address,
            indexTokenAmount,
            minAmountOutputToken,
            swapData,
            issuanceModule,
            isDebtIssuance,
            slippage,
            redeemMaturedPositions,
            { gasLimit }
          )
          logTx(chainId ?? -1, 'FlashMintNotional', redeemTx)
        }
        setIsTransacting(false)
      } catch (error) {
        console.log('Error sending FlashMintNotional tx', error)
        console.log('Override?', override)
        setIsTransacting(false)
        if (
          error instanceof FlashMintNotionalGasEstimateFailedError &&
          error.statusCode === 1003
        ) {
          setTxWouldFail(true)
        }
      }
    },
    [address, signer]
  )

  return { executeFlashMintNotionalTrade, isTransacting, txWouldFail }
}
