import { BigNumber, ethers } from 'ethers'

import { Provider } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { Contract } from '@ethersproject/contracts'
import {
  Exchange,
  getSwapData,
  SwapData,
  ZeroExApi,
} from '@indexcoop/flash-mint-sdk'

import { FLASH_MINT_NOTIONAL_ABI } from './FlashMintNotionalAbi'

export interface FlashMintNotionalQuote {
  indexTokenAmount: BigNumber
  inputOutputTokenAmount: BigNumber
  swapDataDebtCollateral: SwapData
  swapDataPaymentToken: SwapData
}

export const getFlashMintNotionalContract = (
  providerOrSigner: Signer | Provider | undefined,
  chainId: number = 1
): Contract => {
  const contractAddress = '0x9DA9992b5d01BD0EFb1EE8310E8011dc837bd476'
  return new Contract(
    contractAddress,
    FLASH_MINT_NOTIONAL_ABI,
    providerOrSigner
  )
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
    swapDataDebtCollateral: filteredComponents[0],
    swapDataPaymentToken: filteredComponents[1],
  }
}
