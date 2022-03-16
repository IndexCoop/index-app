import { BigNumber, Contract, Signer } from 'ethers'

import { Provider } from '@ethersproject/abstract-provider'

import { ExchangeIssuanceLeveragedAddress } from 'constants/ethContractAddresses'
import { getERC20Contract } from 'utils'
import { EI_LEVERAGED_ABI } from 'utils/abi/EILeveraged'

export enum Exchange {
  None,
  Quickswap,
  Sushiswap,
  UniV3,
}

/**
 * Get the 0x Trade Data for
 */
export const useExchangeIssuanceLeveraged = () => {
  /**
   * Trigger issuance of set token paying with any arbitrary ERC20 token
   *
   * @param library                       library from logged in user
   * @param _setToken                     Set token to issue
   * @param _setAmount                    Amount to issue
   * @param _exchange                     Exchange to use in swap from debt to collateral token
   * @param _swapDataDebtForCollateral    Data (token addresses and fee levels) to describe the swap path from Debt to collateral token
   * @param _swapDataInputToken           Data (token addresses and fee levels) to describe the swap path from eth to collateral token
   */
  const issueExactSetFromETH = async (
    library: any,
    _setToken: string,
    _setAmount: BigNumber,
    _exchange: Exchange,
    _swapDataDebtForCollateral: any,
    _swapDataInputToken: any
  ): Promise<any> => {
    console.log('issueExactSetFromETH')
    try {
      const eiContract = await geExchangeIssuanceLeveragedContract(
        library.getSigner()
      )
      const issueSetTx = await eiContract.issueExactSetFromETH(
        _setToken,
        _setAmount,
        _exchange,
        _swapDataDebtForCollateral,
        _swapDataInputToken
      )
      return issueSetTx
    } catch (err) {
      console.log('error', err)
      return err
    }
  }

  /**
   * Trigger redemption of set token to pay the user with Eth
   *
   * @param library                     library from logged in user
   * @param _setAmount                  Amount to redeem
   * @param _minAmountOutputToken       Minimum amount of ETH to send to the user
   * @param _exchange                   Exchange to use in swap from debt to collateral token
   * @param _swapDataCollateralForDebt  Data (token path and fee levels) describing the swap from Collateral Token to Debt Token
   * @param _swapDataOutputToken        Data (token path and fee levels) describing the swap from Collateral Token to Eth
   */
  const redeemExactSetForETH = async (
    library: any,
    _setAmount: BigNumber,
    _minAmountOutputToken: BigNumber,
    _exchange: Exchange,
    _swapDataCollateralForDebt: any,
    _swapDataOutputToken: any
  ): Promise<any> => {
    console.log('redeemExactSetForETH')
    try {
      const eiContract = await geExchangeIssuanceLeveragedContract(
        library.getSigner()
      )
      const redeemSetTx = await eiContract.redeemExactSetForETH(
        _setAmount,
        _minAmountOutputToken,
        _exchange,
        _swapDataCollateralForDebt,
        _swapDataOutputToken
      )
      return redeemSetTx
    } catch (err) {
      console.log('error', err)
      return err
    }
  }

  /**
   * Trigger issuance of set token paying with any arbitrary ERC20 token
   *
   * @param library                       library from logged in user
   * @param _setToken                     Set token to issue
   * @param _setAmount                    Amount to issue
   * @param _inputToken                   Input token to pay with
   * @param _maxAmountInputToken          Maximum amount of input token to spend
   * @param _exchange                     Exchange to use in swap from debt to collateral token
   * @param _swapDataDebtForCollateral    Data (token addresses and fee levels) to describe the swap path from Debt to collateral token
   * @param _swapDataInputToken           Data (token addresses and fee levels) to describe the swap path from input to collateral token
   */
  const issueExactSetFromERC20 = async (
    library: any,
    _setToken: string,
    _setAmount: BigNumber,
    _inputToken: string,
    _maxAmountInputToken: BigNumber,
    _exchange: Exchange,
    _swapDataDebtForCollateral: any,
    _swapDataInputToken: any
  ): Promise<any> => {
    console.log('issueExactSetFromERC20')
    try {
      const eiContract = await geExchangeIssuanceLeveragedContract(
        library.getSigner()
      )
      const issueSetTx = await eiContract.issueExactSetFromERC20(
        _setToken,
        _setAmount,
        _inputToken,
        _maxAmountInputToken,
        _exchange,
        _swapDataDebtForCollateral,
        _swapDataInputToken
      )
      return issueSetTx
    } catch (err) {
      console.log('error', err)
      return err
    }
  }

  /**
   * Trigger redemption of set token to pay the user with an arbitrary ERC20
   *
   * @param library                     library from logged in user
   * @param _setToken                   Set token to redeem
   * @param _setAmount                  Amount to redeem
   * @param _outputToken                Address of the ERC20 token to send to the user
   * @param _minAmountOutputToken       Minimum amount of output token to send to the user
   * @param _exchange                   Exchange to use in swap from debt to collateral token
   * @param _swapDataCollateralForDebt  Data (token path and fee levels) describing the swap from Collateral Token to Debt Token
   * @param _swapDataOutputToken        Data (token path and fee levels) describing the swap from Collateral Token to Output token
   */
  const redeemExactSetForERC20 = async (
    library: any,
    _setToken: string,
    _setAmount: BigNumber,
    _outputToken: string,
    _minAmountOutputToken: BigNumber,
    _exchange: Exchange,
    _swapDataCollateralForDebt: string,
    _swapDataOutputToken: string
  ): Promise<any> => {
    console.log('redeemExactSetForERC20')
    try {
      const eiContract = await geExchangeIssuanceLeveragedContract(
        library.getSigner()
      )
      const redeemSetTx = await eiContract.redeemExactSetForERC20(
        _setToken,
        _setAmount,
        _outputToken,
        _minAmountOutputToken,
        _exchange,
        _swapDataCollateralForDebt,
        _swapDataOutputToken
      )
      return redeemSetTx
    } catch (err) {
      console.log('error', err)
      return err
    }
  }

  /**
   * Returns the collateral / debt token addresses and amounts for a leveraged index
   *
   * @param library               library from logged in user
   * @param setToken              Address of the SetToken to be issued / redeemed
   * @param setAmount             Amount of SetTokens to issue / redeem
   * @param isIssuance            Boolean indicating if the SetToken is to be issued or redeemed
   *
   * @return Struct containing the collateral / debt token addresses and amounts
   */
  const getLeveragedTokenData = async (
    library: any,
    setToken: string,
    setAmount: BigNumber,
    isIssuance: boolean
  ): Promise<any> => {
    console.log('getLeveragedTokenData')
    try {
      const eiContract = await geExchangeIssuanceLeveragedContract(
        library.getSigner()
      )
      const redeemQuoteTx = await eiContract.getLeveragedTokenData(
        setToken,
        setAmount,
        isIssuance
      )
      return redeemQuoteTx
    } catch (err) {
      console.log('error', err)
      return err
    }
  }

  /**
   * Runs all the necessary approval functions required before issuing or redeeming a SetToken.
   * This function need to be called only once before the first time this smart contract is used on any particular SetToken.
   *
   * @param library                library from logged in user
   * @param setToken               Address of the SetToken being initialized
   *
   */
  const approveSetToken = async (
    library: any,
    setToken: string
  ): Promise<any> => {
    console.log('approveSetToken')
    try {
      const eiContract = await geExchangeIssuanceLeveragedContract(
        library.getSigner()
      )
      const approveSetTokenTx = await eiContract.approveSetToken(setToken)
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
   *
   */
  const approveToken = async (library: any, token: string): Promise<any> => {
    console.log('approveToken')
    try {
      const eiContract = await geExchangeIssuanceLeveragedContract(
        library.getSigner()
      )
      const approveTokenTx = await eiContract.approveToken(token)
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
   *
   */
  const approveTokens = async (
    library: any,
    tokens: string[]
  ): Promise<any> => {
    console.log('approveTokens')
    try {
      const eiContract = await geExchangeIssuanceLeveragedContract(
        library.getSigner()
      )
      const approveTokensTx = await eiContract.approveTokens(tokens)
      return approveTokensTx
    } catch (err) {
      console.log('error', err)
      return err
    }
  }

  /**
   * Returns the tokenAllowance of a given token for a ExchangeIssuanceZeroEx contract.
   * @param account                Address of the account
   * @param library                library from logged in user
   * @param tokenAddress           Address of the token
   *
   * @return tokenAllowance        Token allowance of the account
   */
  const tokenAllowance = async (
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
        ExchangeIssuanceLeveragedAddress
      )
      return BigNumber.from(allowance)
    } catch (err) {
      console.log('error', err)
      return BigNumber.from(0)
    }
  }

  /**
   * returns instance of ExchangeIssuanceLeveraged Contract
   * @param providerSigner
   * @returns EI contract
   */
  const geExchangeIssuanceLeveragedContract = async (
    providerSigner: Signer | Provider | undefined
  ): Promise<Contract> => {
    return await new Contract(
      ExchangeIssuanceLeveragedAddress,
      EI_LEVERAGED_ABI,
      providerSigner
    )
  }

  return {
    issueExactSetFromETH,
    redeemExactSetForETH,
    issueExactSetFromERC20,
    redeemExactSetForERC20,
    getLeveragedTokenData,
    approveSetToken,
    approveToken,
    approveTokens,
    tokenAllowance,
  }
}
