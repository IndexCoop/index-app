import { useCallback, useState } from 'react'

import { Signer } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'

import { DefaultGasLimitFlashMintNotional } from 'constants/gas'
import { FlashMintNotionalQuote } from 'hooks/useBestQuote'
import { useNetwork } from 'hooks/useNetwork'
import { useWallet } from 'hooks/useWallet'
import { useBalanceData } from 'providers/Balances'
import { fromWei } from 'utils'
import { logTx } from 'utils/api/analytics'
import {
  CaptureExchangeIssuanceFunctionKey,
  CaptureExchangeIssuanceKey,
  captureTransaction,
} from 'utils/api/sentry'
import {
  DebtIssuanceModuleV2,
  getFlashMintNotionalContract,
} from 'utils/flashMintNotional/fmNotionalContract'
import { getFlashMintNotionalTransaction } from 'utils/flashMintNotional/fmNotionalTransaction'
import { GasEstimatooor, GasEstimatooorFailedError } from 'utils/gasEstimatooor'
import { getAddressForToken } from 'utils/tokens'

export const useTradeFlashMintNotional = () => {
  const { address, provider, signer } = useWallet()
  const { chainId } = useNetwork()
  const { getTokenBalance } = useBalanceData()

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
        getTokenBalance(inputToken.symbol, chainId) || BigNumber.from(0)
      if (spendingTokenBalance.lt(requiredBalance)) return

      const contract = getFlashMintNotionalContract(signer as Signer, chainId)
      const fixedTokenAddress = isMinting
        ? outputTokenAddress
        : inputTokenAddress
      const issuanceModule = DebtIssuanceModuleV2
      const isDebtIssuance = true
      const redeemMaturedPositions = false

      try {
        setIsTransacting(true)

        const tx = await getFlashMintNotionalTransaction(
          isMinting,
          inputToken,
          outputToken,
          quote.indexTokenAmount,
          quote.inputOutputTokenAmount,
          quote.swapData,
          slippage,
          provider,
          signer,
          chainId
        )

        if (!tx) throw new Error('No transaction object')

        const defaultGasEstimate = BigNumber.from(
          DefaultGasLimitFlashMintNotional
        )
        const gasEstimatooor = new GasEstimatooor(signer, defaultGasEstimate)
        // Will throw error if tx would fail
        // If the user overrides, we take any gas estimate
        const canFail = override
        const gasLimit = await gasEstimatooor.estimate(tx, canFail)

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
            setToken: fixedTokenAddress,
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
            setToken: fixedTokenAddress,
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
          error instanceof GasEstimatooorFailedError &&
          error.statusCode === 1001
        ) {
          setTxWouldFail(true)
        }
      }
    },
    [address, signer]
  )

  return { executeFlashMintNotionalTrade, isTransacting, txWouldFail }
}
