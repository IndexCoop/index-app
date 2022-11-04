import { Contract } from '@ethersproject/contracts'

export class FlashMintNotional {
  contract: Contract

  /**
   * @param contract An instance of an FlashMintNotional contract
   */
  constructor(contract: Contract) {
    this.contract = contract
  }

  // TODO: add interface/functions
}
