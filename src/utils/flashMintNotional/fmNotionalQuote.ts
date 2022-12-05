import { BigNumber, ethers } from 'ethers'

import { Provider } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { Exchange, SwapData } from '@indexcoop/flash-mint-sdk'

import {
  DebtIssuanceModuleV2,
  getFlashMintNotionalContract,
} from './fmNotionalContract'

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
  const issuanceModule = DebtIssuanceModuleV2
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

  // Most swap data can be static if input is DAI/USDC since it won't be picked up.
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
