import { BigNumber } from '@ethersproject/bignumber'
import { Web3Provider } from '@ethersproject/providers'

export class GasStation {
  provider: Web3Provider
  constructor(provider: Web3Provider) {
    this.provider = provider
  }

  async getGasPrice(): Promise<BigNumber> {
    const gasPrice = await this.provider.getGasPrice()
    return gasPrice
  }
}
