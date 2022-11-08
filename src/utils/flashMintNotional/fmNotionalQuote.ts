import { BigNumber, ethers } from 'ethers'

import { Provider } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import {
  Exchange,
  getSwapData,
  SwapData,
  ZeroExApi,
} from '@indexcoop/flash-mint-sdk'

import { getFlashMintNotionalContract } from './fmNotionalContract'

export interface FlashMintNotionalQuote {
  indexTokenAmount: BigNumber
  inputOutputTokenAmount: BigNumber
  swapData: SwapData[]
}

export const getFlashMintNotionalQuote = async (
  isMinting: boolean,
  fixedTokenAddress: string,
  inputOutputTokenAddress: string,
  amountIndexToken: BigNumber,
  slippagePercent: number,
  providerOrSigner: Signer | Provider | undefined
): Promise<FlashMintNotionalQuote> => {
  console.log('getFlashMintNotionalQuote')
  const contract = getFlashMintNotionalContract(providerOrSigner)
  const issuanceModule = '0xa0a98EB7Af028BE00d04e46e1316808A62a8fd59'
  const isDebtIssuance = true
  const slippage = ethers.utils.parseEther(slippagePercent.toString())

  console.log(contract.address)
  console.log(providerOrSigner)

  const [filteredComponents] = isMinting
    ? await contract.getFilteredComponentsIssuance(
        fixedTokenAddress,
        amountIndexToken,
        issuanceModule,
        isDebtIssuance,
        slippage
      )
    : await contract.getFilteredComponentsRedemption(
        fixedTokenAddress,
        amountIndexToken,
        issuanceModule,
        isDebtIssuance,
        slippage
      )
  console.log('///////////////')
  console.log('NOTIONAL')
  console.log(filteredComponents)

  const swapData = isMinting
    ? filteredComponents.map((component: string) => {
        return {
          // input token adress
          path: [inputOutputTokenAddress, component],
          fees: [3000],
          pool: ethers.constants.AddressZero,
          exchange: Exchange.UniV3,
        }
      })
    : filteredComponents.map((component: string) => {
        return {
          // output token adress
          path: [component, inputOutputTokenAddress],
          fees: [3000],
          pool: ethers.constants.AddressZero,
          exchange: Exchange.UniV3,
        }
      })

  console.log('SwapData', swapData)

  // FIXME: return quote
  return {
    indexTokenAmount: amountIndexToken,
    // TODO:
    inputOutputTokenAmount: BigNumber.from(0),
    swapData,
  }
}
