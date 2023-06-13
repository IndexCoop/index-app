import { BigNumber, Contract } from 'ethers'

import { JsonRpcProvider } from '@ethersproject/providers'

import { ETH, MATIC, Token } from '../../../constants/tokens'
import { ERC20Interface } from '../../utils/abi/interfaces'

import { BalanceValues } from '.'

type Providers = {
  mainnet: JsonRpcProvider
  optimism: JsonRpcProvider
  polygon: JsonRpcProvider
}

export class BalancesProvider {
  constructor(readonly address: string, readonly providers: Providers) {}

  async fetchNativeBalances() {
    const { address, providers } = this
    const ethBalance = await providers.mainnet.getBalance(address)
    const maticBalance = await providers.polygon.getBalance(address)

    const eth: BalanceValues = {
      token: ETH,
      mainnetBalance: ethBalance,
      optimismBalance: null,
      polygonBalance: null,
      price: 0,
    }

    const matic: BalanceValues = {
      token: MATIC,
      mainnetBalance: null,
      optimismBalance: null,
      polygonBalance: maticBalance,
      price: 0,
    }

    return {
      eth,
      matic,
    }
  }

  async fetchAllBalances(token: Token) {
    const { address, providers } = this
    const mainnetBalance = token.address
      ? await getBalance(address, token.address, providers.mainnet)
      : null
    const optimismBalance = null
    // const optimismBalance = token.optimismAddress
    //   ? await getBalance(address, token.optimismAddress, providers.optimism)
    //   : null
    const polygonBalance = null
    // const polygonBalance = token.polygonAddress
    //   ? await getBalance(address, token.polygonAddress, providers.polygon)
    //   : null
    return {
      mainnetBalance,
      optimismBalance,
      polygonBalance,
    }
  }
}

const getBalance = async (
  address: string,
  tokenAddress: string | undefined,
  provider: JsonRpcProvider
): Promise<BigNumber | null> => {
  if (!tokenAddress) return null
  const contract = new Contract(tokenAddress, ERC20Interface, provider)
  const bal = await contract.balanceOf(address)
  return bal
}
