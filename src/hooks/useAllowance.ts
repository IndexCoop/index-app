import { utils } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { useContractCall, useEthers } from '@usedapp/core'

import { ERC20_ABI } from 'utils/abi/ERC20'

const ERC20Interface = new utils.Interface(ERC20_ABI)

/**
 * Get the approved allowance/spending for an ERC20
 */
export const useAllowance = (
  tokenAddress?: string,
  spenderAddress?: string
): BigNumber | undefined => {
  const { account } = useEthers()

  const [allowance] =
    useContractCall(
      account &&
        tokenAddress &&
        spenderAddress && {
          abi: ERC20Interface,
          address: tokenAddress,
          method: 'allowance',
          args: [account, spenderAddress],
        }
    ) ?? []
  return allowance
}
