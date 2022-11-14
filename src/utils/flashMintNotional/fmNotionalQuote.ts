import { BigNumber, ethers } from 'ethers'

import { Provider } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { Exchange, SwapData } from '@indexcoop/flash-mint-sdk'

import { getFlashMintNotionalContract } from './fmNotionalContract'

export interface FlashMintNotionalQuote {
  indexTokenAmount: BigNumber
  inputOutputTokenAmount: BigNumber
  swapData: SwapData[]
}

type FilteredComponentsResponse = {
  filteredComponents: string[]
  filteredUnits: BigNumber[]
}

export const getFlashMintNotionalQuote = async (
  isMinting: boolean,
  fixedTokenAddress: string,
  inputOutputTokenAddress: string,
  amountIndexToken: BigNumber,
  slippagePercent: number,
  providerOrSigner: Signer | Provider | undefined
): Promise<FlashMintNotionalQuote> => {
  const contract = getFlashMintNotionalContract(providerOrSigner)
  const issuanceModule = '0xa0a98EB7Af028BE00d04e46e1316808A62a8fd59'
  const isDebtIssuance = true
  const slippage = ethers.utils.parseEther(slippagePercent.toString())

  const { filteredComponents, filteredUnits }: FilteredComponentsResponse =
    isMinting
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

  const inputOutputTokenAmount = filteredUnits.reduce((prevVal, currentVal) => {
    return prevVal.add(currentVal)
  })

  return {
    indexTokenAmount: amountIndexToken,
    inputOutputTokenAmount,
    swapData,
  }
}
