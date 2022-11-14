import { Provider } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { Contract } from '@ethersproject/contracts'

import { FLASH_MINT_NOTIONAL_ABI } from './FlashMintNotionalAbi'

export const FlashMintNotionalContractAddress =
  '0x9DA9992b5d01BD0EFb1EE8310E8011dc837bd476'

export const getFlashMintNotionalContract = (
  providerOrSigner: Signer | Provider | undefined,
  chainId: number = 1
): Contract => {
  const contractAddress = FlashMintNotionalContractAddress
  return new Contract(
    contractAddress,
    FLASH_MINT_NOTIONAL_ABI,
    providerOrSigner
  )
}
