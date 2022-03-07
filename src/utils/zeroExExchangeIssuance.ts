import { BigNumber, Contract, ethers, Signer } from 'ethers'

import { Provider } from '@ethersproject/abstract-provider'

import { zeroExExchangeIssuanceAddress } from 'constants/ethContractAddresses'
import { getERC20Contract, preciseMul, toWei } from 'utils'

import { EI0X_ABI } from './abi/EI0X'

/**
 * Returns transaction for the following:
 * Issues an exact amount of SetTokens for given amount of ETH.
 * The excess amount of tokens is returned in an equivalent amount of ether.
 *
 * @param library                library from logged in user
 * @param setToken               Address of the SetToken to be issued
 * @param amountSetToken         Amount of SetTokens to issue
 * @param componentQuotes        The encoded 0x transactions to execute
 * @param issuanceModule         Address of issuance Module to use
 * @param isDebtIssuance         Flag indicating wether given issuance module is a debt issuance module
 *
 * @return amountEthReturn       Amount of ether returned to the caller
 */
export const issueExactSetFromETH = async (
  library: any,
  setToken: string,
  amountSetToken: BigNumber,
  componentQuotes: any[],
  issuanceModule: string,
  isDebtIssuance: boolean
): Promise<any> => {
  console.log('issueExactSetFromETH')
  try {
    const eiContract = await getExchangeIssuanceContract(library.getSigner())
    const issueSetTx = await eiContract.issueExactSetFromETH(
      setToken,
      amountSetToken,
      componentQuotes,
      issuanceModule,
      isDebtIssuance
    )
    return issueSetTx
  } catch (err) {
    console.log('error', err)
    return err
  }
}

/**
 * Returns transaction for the following:
 * Redeems an exact amount of SetTokens for ETH.
 * The SetToken must be approved by the sender to this contract.
 *
 * @param library                library from logged in user
 * @param setToken               Address of the SetToken to be issued
 * @param minEthReceive          Minimum amount of Eth to receive
 * @param componentQuotes        The encoded 0x transactions to execute
 * @param issuanceModule         Address of issuance Module to use
 * @param isDebtIssuance         Flag indicating wether given issuance module is a debt issuance module
 *
 * @return outputAmount          Amount of output tokens sent to the caller
 */
export const redeemExactSetForETH = async (
  library: any,
  setToken: string,
  minEthReceive: BigNumber,
  componentQuotes: any[],
  issuanceModule: string,
  isDebtIssuance: boolean
): Promise<any> => {
  console.log('redeemExactSetForETH')
  try {
    const eiContract = await getExchangeIssuanceContract(library.getSigner())
    const redeemSetTx = await eiContract.issueExactSetFromETH(
      setToken,
      minEthReceive,
      componentQuotes,
      issuanceModule,
      isDebtIssuance
    )
    return redeemSetTx
  } catch (err) {
    console.log('error', err)
    return err
  }
}

/**
 * Returns transaction to get component & position quotes for token issuance
 *
 * @param library                library from logged in user
 * @param issuanceModule         Address of issuance Module to use
 * @param isDebtIssuance         Flag indicating wether given issuance module is a debt issuance module
 * @param setToken               Address of the SetToken to be issued
 * @param amountSetToken         Amount of SetTokens to issue
 *
 * @return componenets           Array of component addresses
 * @return positions             Array of component positions
 */
export const getRequiredIssuanceComponents = async (
  library: any,
  issuanceModule: string,
  isDebtIssuance: boolean,
  setToken: string,
  amountSetToken: BigNumber
): Promise<any> => {
  console.log('issueExactSetFromToken')
  // TODO: Make match 0x methods from chirstians contracts
  try {
    const eiContract = await getExchangeIssuanceContract(library.getSigner())
    const issueQuoteTx = await eiContract.getRequiredIssuanceComponents(
      issuanceModule,
      isDebtIssuance,
      setToken,
      amountSetToken
    )
    return issueQuoteTx
  } catch (err) {
    console.log('error', err)
    return err
  }
}

/**
 * Returns transaction for the following:
 * Issues an exact amount of SetTokens for given amount of input ERC20 tokens.
 * The excess amount of tokens is returned in an equivalent amount of ether.
 *
 * @param library                library from logged in user
 * @param setToken               Address of the SetToken to be issued
 * @param inputToken             Address of the input token
 * @param amountSetToken         Amount of SetTokens to issue
 * @param maxAmountInputToken    Maximum amount of input tokens to be used to issue SetTokens.
 * @param componentQuotes        The encoded 0x transactions to execute
 * @param issuanceModule         Address of issuance Module to use
 * @param isDebtIssuance         Flag indicating wether given issuance module is a debt issuance module
 *
 * @return totalInputTokenSold   Amount of input token spent for issuance
 */
export const issueExactSetFromToken = async (
  library: any,
  setToken: string,
  inputToken: string,
  amountSetToken: BigNumber,
  maxAmountInputToken: BigNumber,
  componentQuotes: any[],
  issuanceModule: string,
  isDebtIssuance: boolean
): Promise<any> => {
  console.log('issueExactSetFromToken')
  // TODO: Make match 0x methods from chirstians contracts
  try {
    const eiContract = await getExchangeIssuanceContract(library.getSigner())
    const issueSetTx = await eiContract.issueExactSetFromToken(
      setToken,
      inputToken,
      amountSetToken,
      maxAmountInputToken,
      componentQuotes,
      issuanceModule,
      isDebtIssuance
    )
    return issueSetTx
  } catch (err) {
    console.log('error', err)
    return err
  }
}

/**
 * Returns transaction for the following:
 * Issues an exact amount of SetTokens for given amount of input ERC20 tokens.
 * The excess amount of tokens is returned in an equivalent amount of ether.
 *
 * @param library                library from logged in user
 * @param setToken               Address of the SetToken to be issued
 * @param outputToken            Address of the input token
 * @param amountSetToken         Amount of SetTokens to issue
 * @param minOutputReceive       Minimum amount of output token to receive
 * @param componentQuotes        The encoded 0x transactions to execute
 * @param issuanceModule         Address of issuance Module to use
 * @param isDebtIssuance         Flag indicating wether given issuance module is a debt issuance module
 *
 * @return outputAmount          Amount of output tokens sent to the caller
 */
export const redeemExactSetForToken = async (
  library: any,
  setToken: string,
  outputToken: string,
  amountSetToken: BigNumber,
  minOutputReceive: BigNumber,
  componentQuotes: any[],
  issuanceModule: string,
  isDebtIssuance: boolean
): Promise<any> => {
  console.log('issueExactSetFromToken')
  // TODO: Make match 0x methods from chirstians contracts
  try {
    const eiContract = await getExchangeIssuanceContract(library.getSigner())
    const redeemSetTx = await eiContract.issueExactSetFromToken(
      setToken,
      outputToken,
      amountSetToken,
      minOutputReceive,
      componentQuotes,
      issuanceModule,
      isDebtIssuance
    )
    return redeemSetTx
  } catch (err) {
    console.log('error', err)
    return err
  }
}

/**
 * Returns transaction to get component & position quotes for token redemption
 *
 * @param library                library from logged in user
 * @param issuanceModule         Address of issuance Module to use
 * @param isDebtIssuance         Flag indicating wether given issuance module is a debt issuance module
 * @param setToken               Address of the SetToken to be issued
 * @param amountSetToken         Amount of SetTokens to issue
 *
 * @return componenets           Array of component addresses
 * @return positions             Array of component positions
 */
export const getRequiredRedemptionComponents = async (
  library: any,
  issuanceModule: string,
  isDebtIssuance: boolean,
  setToken: string,
  amountSetToken: BigNumber
): Promise<any> => {
  console.log('issueExactSetFromToken')
  // TODO: Make match 0x methods from chirstians contracts
  try {
    const eiContract = await getExchangeIssuanceContract(library.getSigner())
    const redeemQuoteTx = await eiContract.getRequiredRedemptionComponents(
      issuanceModule,
      isDebtIssuance,
      setToken,
      amountSetToken
    )
    return redeemQuoteTx
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
