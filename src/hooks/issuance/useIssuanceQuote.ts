import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'

import { FlashMintPerp } from 'constants/contractAddresses'
import { Token } from 'constants/tokens'
import { useWallet } from 'hooks/useWallet'
import { FlashMintPerpInterface } from 'utils/abi/interfaces'

/**
 * Approve the spending of an ERC20
 */
export const useIssuanceQuote = () => {
  const { signer } = useWallet()

  const getQuote = async (
    isIssue: Boolean,
    token: Token,
    amount: BigNumber
  ): Promise<BigNumber | null> => {
    if (!signer || !token.optimismAddress || amount.eq(BigNumber.from('0'))) {
      console.log(
        'Error no signer or token not on Optimism or amount not bigger than 0'
      )
      return null
    }
    try {
      const contract = new Contract(
        FlashMintPerp,
        FlashMintPerpInterface,
        signer
      )
      if (isIssue) {
        const quote =
          await contract.callStatic.getUsdcAmountInForFixedSetOffChain(
            token.optimismAddress,
            amount
          )
        return BigNumber.from(quote.toString())
      } else {
        const quote =
          await contract.callStatic.getUsdcAmountOutForFixedSetOffChain(
            token.optimismAddress,
            amount
          )
        const quoteWithSlippage = BigNumber.from(quote.toString())
          .mul(99)
          .div(100)
        return quoteWithSlippage
      }
    } catch (error) {
      console.log('Error getting quote for perp issuance', error)
      return null
    }
  }

  return {
    getQuote,
  }
}
