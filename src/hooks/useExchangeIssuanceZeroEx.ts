import { BigNumber, Contract, Signer } from 'ethers'

import { Provider, TransactionResponse } from '@ethersproject/providers'

import { EI_ZEROEX_ABI } from 'utils/abi/EIZeroEx'
import { get0xExchangeIssuanceContract } from 'utils/contracts'

interface RequiredComponentsResponse {
  components: string[]
  positions: BigNumber[]
}

/**
 * returns instance of ExchangeIssuanceZeroEx Contract
 * @param providerSigner  web3 provider or signer
 * @param chainId         chain ID for current connected network
 * @returns instance of 0x exchange issuance contract
 */
export const getExchangeIssuanceZeroExContract = async (
  providerSigner: Signer | Provider | undefined,
  chainId: number
): Promise<Contract> => {
  const contractAddress = get0xExchangeIssuanceContract(chainId)
  return new Contract(contractAddress, EI_ZEROEX_ABI, providerSigner)
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
  contract: Contract,
  issuanceModule: string,
  isDebtIssuance: boolean,
  setToken: string,
  amountSetToken: BigNumber
): Promise<RequiredComponentsResponse> => {
  try {
    const issueQuoteTx = await contract.getRequiredIssuanceComponents(
      issuanceModule,
      isDebtIssuance,
      setToken,
      amountSetToken
    )
    return issueQuoteTx
  } catch (err) {
    console.log('Error getting required issuance components/positions', err)
    return { components: [], positions: [] }
  }
}

/**
 * Returns transaction to get component & position quotes for token redemption
 *
 * @param library                library from logged in user
 * @param issuanceModule         Address of issuance Module to use
 * @param isDebtIssuance         Flag indicating wether given issuance module is a debt issuance module
 * @param setToken               Address of the SetToken to be redeemed
 * @param amountSetToken         Amount of SetTokens to redeem
 *
 * @return componenets           Array of component addresses
 * @return positions             Array of component positions
 */
export const getRequiredRedemptionComponents = async (
  contract: Contract,
  issuanceModule: string,
  isDebtIssuance: boolean,
  setToken: string,
  amountSetToken: BigNumber
): Promise<RequiredComponentsResponse> => {
  console.log('getRequiredRedemptionComponents')
  try {
    const redeemQuoteTx = await contract.getRequiredRedemptionComponents(
      issuanceModule,
      isDebtIssuance,
      setToken,
      amountSetToken
    )
    return redeemQuoteTx
  } catch (err) {
    console.log('error', err)
    return { components: [], positions: [] }
  }
}

/**
 * Get the 0x Trade Data for
 */
export const useExchangeIssuanceZeroEx = () => {
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
  const issueExactSetFromETH = async (
    contract: Contract,
    setToken: string,
    amountSetToken: BigNumber,
    componentQuotes: any[],
    issuanceModule: string,
    isDebtIssuance: boolean,
    maxInput: BigNumber,
    gasLimit: BigNumber
  ): Promise<TransactionResponse | null> => {
    console.log('issueExactSetFromETH')
    try {
      const issueSetTx = await contract.issueExactSetFromETH(
        setToken,
        amountSetToken,
        componentQuotes,
        issuanceModule,
        isDebtIssuance,
        { value: maxInput, gasLimit }
      )
      return issueSetTx
    } catch (err) {
      console.log('error', err)
      return null
    }
  }

  /**
   * Returns transaction for the following:
   * Redeems an exact amount of SetTokens for ETH.
   * The SetToken must be approved by the sender to this contract.
   *
   * @param library                library from logged in user
   * @param setToken               Address of the SetToken to be redeemed
   * @param amountSetToken         Amount of set token to redeem
   * @param minEthReceive          Minimum amount of Eth to receive
   * @param componentQuotes        The encoded 0x transactions to execute
   * @param issuanceModule         Address of issuance Module to use
   * @param isDebtIssuance         Flag indicating wether given issuance module is a debt issuance module
   *
   * @return outputAmount          Amount of output tokens sent to the caller
   */
  const redeemExactSetForETH = async (
    contract: Contract,
    setToken: string,
    amountSetToken: BigNumber,
    minEthReceive: BigNumber,
    componentQuotes: any[],
    issuanceModule: string,
    isDebtIssuance: boolean,
    gasLimit: BigNumber
  ): Promise<TransactionResponse | null> => {
    console.log('redeemExactSetForETH')
    try {
      const redeemSetTx = await contract.redeemExactSetForETH(
        setToken,
        amountSetToken,
        minEthReceive,
        componentQuotes,
        issuanceModule,
        isDebtIssuance,
        { gasLimit }
      )
      return redeemSetTx
    } catch (err) {
      console.log('error', err)
      return null
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
  const getRequiredIssuanceComponents = async (
    contract: Contract,
    issuanceModule: string,
    isDebtIssuance: boolean,
    setToken: string,
    amountSetToken: BigNumber
  ): Promise<RequiredComponentsResponse> => {
    try {
      const issueQuoteTx = await contract.getRequiredIssuanceComponents(
        issuanceModule,
        isDebtIssuance,
        setToken,
        amountSetToken
      )
      return issueQuoteTx
    } catch (err) {
      console.log('error', err)
      return { components: [], positions: [] }
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
  const issueExactSetFromToken = async (
    contract: Contract,
    setToken: string,
    inputToken: string,
    amountSetToken: BigNumber,
    maxAmountInputToken: BigNumber,
    componentQuotes: any[],
    issuanceModule: string,
    isDebtIssuance: boolean,
    gasLimit: BigNumber
  ): Promise<TransactionResponse | null> => {
    console.log('issueExactSetFromToken')
    try {
      const issueSetTx = await contract.issueExactSetFromToken(
        setToken,
        inputToken,
        amountSetToken,
        maxAmountInputToken,
        componentQuotes,
        issuanceModule,
        isDebtIssuance,
        {
          gasLimit,
        }
      )
      return issueSetTx
    } catch (err) {
      console.log('error', err)
      return null
    }
  }

  /**
   * Returns transaction for the following:
   * Issues an exact amount of SetTokens for given amount of input ERC20 tokens.
   * The excess amount of tokens is returned in an equivalent amount of ether.
   *
   * @param library                library from logged in user
   * @param setToken               Address of the SetToken to be redeemed
   * @param outputToken            Address of the output token
   * @param amountSetToken         Amount of output token to redeem
   * @param minOutputReceive       Minimum amount of output token to receive
   * @param componentQuotes        The encoded 0x transactions to execute
   * @param issuanceModule         Address of issuance Module to use
   * @param isDebtIssuance         Flag indicating wether given issuance module is a debt issuance module
   *
   * @return outputAmount          Amount of output tokens sent to the caller
   */
  const redeemExactSetForToken = async (
    contract: Contract,
    setToken: string,
    outputToken: string,
    amountSetToken: BigNumber,
    minOutputReceive: BigNumber,
    componentQuotes: any[],
    issuanceModule: string,
    isDebtIssuance: boolean,
    gasLimit: BigNumber
  ): Promise<TransactionResponse | null> => {
    console.log('redeemExactSetForToken')
    try {
      // Calculate a slightly higher _maxAmountInputToken so it doesn't revert
      const higherMax = BigNumber.from(amountSetToken).mul(BigNumber.from(2))
      const redeemSetTx = await contract.redeemExactSetForToken(
        setToken,
        outputToken,
        higherMax, // TODO: Replace this with the proper setAmount
        minOutputReceive,
        componentQuotes,
        issuanceModule,
        isDebtIssuance,
        {
          gasLimit,
          maxFeePerGas: 100000000000,
          maxPriorityFeePerGas: 2000000000,
        }
      )
      return redeemSetTx
    } catch (err) {
      console.log('error', err)
      return null
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
  const getRequiredRedemptionComponents = async (
    contract: Contract,
    issuanceModule: string,
    isDebtIssuance: boolean,
    setToken: string,
    amountSetToken: BigNumber
  ): Promise<RequiredComponentsResponse> => {
    console.log('getRequiredRedemptionComponents')
    try {
      const redeemQuoteTx = await contract.getRequiredRedemptionComponents(
        issuanceModule,
        isDebtIssuance,
        setToken,
        amountSetToken
      )
      return redeemQuoteTx
    } catch (err) {
      console.log('error', err)
      return { components: [], positions: [] }
    }
  }

  /**
   * Runs all the necessary approval functions required before issuing or redeeming a SetToken.
   * This function need to be called only once before the first time this smart contract is used on any particular SetToken.
   *
   * @param library                library from logged in user
   * @param setToken               Address of the SetToken being initialized
   * @param issuanceModule         Address of the issuance module which will be approved to spend component tokens.
   *
   */
  const approveSetToken = async (
    contract: Contract,
    setToken: string,
    issuanceModule: string
  ): Promise<any> => {
    console.log('approveSetToken')
    try {
      const approveSetTokenTx = await contract.approveSetToken(
        setToken,
        issuanceModule
      )
      return approveSetTokenTx
    } catch (err) {
      console.log('error', err)
      return err
    }
  }

  /**
   * Runs all the necessary approval functions required for a given ERC20 token.
   * This function can be called when a new token is added to a SetToken during a rebalance.
   *
   * @param library                library from logged in user
   * @param token                  Address of the token which needs approval
   * @param spender                Address of the spender which will be approved to spend token. (Must be a whitlisted issuance module)
   *
   */
  const approveToken = async (
    contract: Contract,
    token: string,
    spender: string
  ): Promise<any> => {
    console.log('approveToken')
    try {
      const approveTokenTx = await contract.approveToken(token, spender)
      return approveTokenTx
    } catch (err) {
      console.log('error', err)
      return err
    }
  }

  /**
   * Runs all the necessary approval functions required for a list of ERC20 tokens.
   *
   * @param library                library from logged in user
   * @param tokens                 Addresses of the tokens which needs approval
   * @param spender                Address of the spender which will be approved to spend token. (Must be a whitlisted issuance module)
   *
   */
  const approveTokens = async (
    contract: Contract,
    tokens: string[],
    spender: string
  ): Promise<any> => {
    console.log('approveTokens')
    try {
      const approveTokensTx = await contract.approveTokens(tokens, spender)
      return approveTokensTx
    } catch (err) {
      console.log('error', err)
      return err
    }
  }

  return {
    getRequiredIssuanceComponents,
    getRequiredRedemptionComponents,
    issueExactSetFromETH,
    issueExactSetFromToken,
    redeemExactSetForETH,
    redeemExactSetForToken,
    approveSetToken,
    approveToken,
    approveTokens,
  }
}
