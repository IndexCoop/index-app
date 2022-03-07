import { BigNumber, Contract, ethers, Signer } from 'ethers'

import { Provider } from '@ethersproject/abstract-provider'

import { zeroExExchangeIssuanceAddress } from 'constants/ethContractAddresses'
import { getERC20Contract, preciseMul, toWei } from 'utils'

import { EI0X_ABI } from './abi/EI0X'

/**
 * Issues an exact amount of SetTokens for given amount of input ERC20 tokens.
 * The excess amount of tokens is returned in an equivalent amount of ether.
 *
 * @param library                library from logged in user
 * @param buyTokenAddress        Address of the ERC20 token to buy
 * @param sellTokenAddress       Address of the ERC20 token to sell
 * @param maxAmountInput         Maximum amount of input tokens to be used to issue SetTokens.
 * @param componentQuotes        The encoded 0x transactions to execute
 *
 * @return totalInputTokenSold   Amount of input token spent for issuance
 */
export const issueExactSetFromToken = async (
  library: any,
  buyTokenAddress: string,
  sellTokenAddress: string,
  tokenAmount: BigNumber,
  maxAmountInput: BigNumber,
  componentQuotes: any[]
): Promise<any> => {
  console.log('issueExactSetFromToken')
  // TODO: Make match 0x methods from chirstians contracts
  try {
    const eiContract = await getExchangeIssuanceContract(library.getSigner())
    const issueSetTx = await eiContract.issueExactSetFromToken(
      buyTokenAddress,
      sellTokenAddress,
      tokenAmount,
      maxAmountInput
    )
    return issueSetTx
  } catch (err) {
    console.log('error', err)
    return err
  }
}

export const approveTokenForEI = async (library: any, tokenAddress: string) => {
  try {
    const tokenContract = await getERC20Contract(
      library.getSigner(),
      tokenAddress
    )
    const approvalTx = await tokenContract.approve(
      zeroExExchangeIssuanceAddress,
      ethers.constants.MaxUint256
    )
    return approvalTx
  } catch (err) {
    console.log('error', err)
    return err
  }
}

export const tokenAllowance = async (
  account: any,
  library: any,
  tokenAddress: string
): Promise<BigNumber> => {
  try {
    const tokenContract = await getERC20Contract(
      library.getSigner(),
      tokenAddress
    )
    const allowance = await tokenContract.allowance(
      account,
      zeroExExchangeIssuanceAddress
    )
    return BigNumber.from(allowance)
  } catch (err) {
    console.log('error', err)
    return BigNumber.from(0)
  }
}

export const getMaxIn = async (
  library: any,
  amountOut: BigNumber,
  buyTokenAddress: string,
  sellTokenAddress: string
): Promise<BigNumber> => {
  const exchangeIssuance = await getExchangeIssuanceContract(
    library.getSigner()
  )
  const value = await exchangeIssuance.getAmountInToIssueExactSet(
    buyTokenAddress,
    sellTokenAddress,
    amountOut
  )
  return preciseMul(value, toWei(1.05))
}

export const getSetValue = async (
  library: any,
  buyTokenAddress: string,
  sellTokenAddress: string
): Promise<BigNumber> => {
  const exchangeIssuance = await getExchangeIssuanceContract(
    library.getSigner()
  )
  const value = await exchangeIssuance.getAmountInToIssueExactSet(
    buyTokenAddress,
    sellTokenAddress,
    toWei(1)
  )
  return value
}

/**
 * returns instance of Exchange Issuance Contract
 * @param providerSigner
 * @returns
 */
export const getExchangeIssuanceContract = async (
  providerSigner: Signer | Provider | undefined
): Promise<Contract> => {
  return await new Contract(
    zeroExExchangeIssuanceAddress,
    EI0X_ABI,
    providerSigner
  )
}
