import { BigNumber } from '@ethersproject/bignumber'
import {
  getExchangeIssuanceZeroExContract,
  getIssuanceModule,
} from '@indexcoop/index-exchange-issuance-sdk'

import { ETH, MATIC, Token } from 'constants/tokens'
import { toWei } from 'utils'
import { getAddressForToken } from 'utils/tokens'

// TODO: check scaling based on component counts (quoteData)
const defaultGasEstimate = BigNumber.from(5000000)

export async function getExchangeIssuanceGasEstimate(
  provider: any,
  chainId: number,
  isIssuance: boolean,
  inputToken: Token,
  outputToken: Token,
  setTokenAmount: BigNumber,
  inputTokenAmount: BigNumber,
  inputTokenBalance: BigNumber,
  quoteData: string[]
): Promise<BigNumber> {
  const signer = provider?.getSigner()

  // Return default - as we can't fetch an estimate without a signer
  if (!signer) return defaultGasEstimate

  // Return default - as this would otherwise throw an error
  if (inputTokenAmount.gt(inputTokenBalance)) return defaultGasEstimate

  let gasEstimate = defaultGasEstimate

  const setTokenSymbol = isIssuance ? outputToken.symbol : inputToken.symbol
  const issuanceModule = getIssuanceModule(setTokenSymbol, chainId)

  const outputTokenAddress = getAddressForToken(outputToken, chainId)
  const inputTokenAddress = getAddressForToken(inputToken, chainId)
  if (!outputTokenAddress || !inputTokenAddress) return gasEstimate

  try {
    const contract = getExchangeIssuanceZeroExContract(signer, chainId ?? 1)

    if (isIssuance) {
      const isSellingNativeChainToken =
        inputToken.symbol === ETH.symbol || inputToken.symbol === MATIC.symbol

      if (isSellingNativeChainToken) {
        gasEstimate = await contract.estimateGas.issueExactSetFromETH(
          outputTokenAddress,
          setTokenAmount,
          quoteData,
          issuanceModule.address,
          issuanceModule.isDebtIssuance,
          { value: inputTokenAmount, gasLimit: gasEstimate }
        )
      } else {
        const maxAmountInputToken = inputTokenAmount
        gasEstimate = await contract.estimateGas.issueExactSetFromToken(
          outputTokenAddress,
          inputTokenAddress,
          setTokenAmount,
          maxAmountInputToken,
          quoteData,
          issuanceModule.address,
          issuanceModule.isDebtIssuance,
          { gasLimit: gasEstimate }
        )
      }
    } else {
      const isRedeemingNativeChainToken =
        inputToken.symbol === ETH.symbol || inputToken.symbol === MATIC.symbol
      const minOutputReceive = inputTokenAmount

      if (isRedeemingNativeChainToken) {
        gasEstimate = await contract.estimateGas.redeemExactSetForETH(
          inputTokenAddress,
          setTokenAmount,
          minOutputReceive,
          quoteData,
          issuanceModule.address,
          issuanceModule.isDebtIssuance,
          { gasLimit: gasEstimate }
        )
      } else {
        gasEstimate = await contract.estimateGas.redeemExactSetForToken(
          inputTokenAddress,
          outputTokenAddress,
          setTokenAmount,
          minOutputReceive,
          quoteData,
          issuanceModule.address,
          issuanceModule.isDebtIssuance,
          {
            gasLimit: gasEstimate,
            maxFeePerGas: 100000000000,
            maxPriorityFeePerGas: 2000000000,
          }
        )
      }
    }
  } catch (error) {
    console.log('Error estimating gas for 0x exchange issuance:', error)
    return defaultGasEstimate
  }

  // Adjust gas estiamte for complexity of 0x contract
  gasEstimate = gasEstimate.mul(toWei(2.2, 1))

  return gasEstimate
}
