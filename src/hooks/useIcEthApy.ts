import { utils } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { useContractCall, useEthers } from '@usedapp/core'

import { ERC20_ABI } from 'utils/abi/ERC20'

const ERC20Interface = new utils.Interface(ERC20_ABI)

/**
 * Get's the current APY on icETH
 */
export const useIcEthApy = () => {
  const { account } = useEthers()

  // icETH contract address 0x7C07F7aBe10CE8e33DC6C5aD68FE033085256A84
  // t0 = gets balance of aSTETH (0x1982b2F5814301d4e9a8b0201555376e62F82428) balance of icETH token contract
  // t1 = gets avdWETH (0xF63B34710400CAd3e044cFfDcAb00a0f32E33eCf) balance of icETH token contract
  // levRatio = t0 / (t0-t1)

  // netYield = (levRatio - 1) * (stETH yield [1] - ethBorrowRate [2]) + stETH yield - 0.009
  // need stETH yield and eth borrow rate

  // [1] stETH yield: https://docs.lido.fi/contracts/lido-oracle/#getlastcompletedreportdelta
  // can be used to calculate stETH yield (APR) over time period
  // [2] ethBorrowRate: [currentVariableBorrowRate] = LendingPool.getReserveData(asset.address) <- aave v2 mainnet lendingpool contract https://docs.aave.com/developers/v/2.0/the-core-protocol/lendingpool
  return
}
