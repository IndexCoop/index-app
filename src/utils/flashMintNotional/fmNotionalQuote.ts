import { ethers, BigNumber } from 'ethers'
import { Provider } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { Contract } from '@ethersproject/contracts'

import { FLASH_MINT_NOTIONAL_ABI } from './FlashMintNotionalAbi'

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
  fixedTokenAddress: string,
  amountIndexToken: BigNumber,
  slippage: number,
  providerOrSigner: Signer | Provider | undefined
) => {
  console.log('getFlashMintNotionalQuote')
  const contract = getFlashMintNotionalContract(providerOrSigner)
  const issuanceModule = '0xa0a98EB7Af028BE00d04e46e1316808A62a8fd59'
  const isDebtIssuance = true

  console.log(contract.address)
  console.log(providerOrSigner)

  const [filteredComponents] = await contract.getFilteredComponentsIssuance(
    fixedTokenAddress,
    amountIndexToken,
    issuanceModule,
    isDebtIssuance,
    ethers.utils.parseEther(slippage.toString())
  )
  console.log('///////////////')
  console.log('NOTIONAL')
  console.log(filteredComponents)
}
