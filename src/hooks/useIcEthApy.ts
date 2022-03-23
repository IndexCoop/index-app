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
  // t0 = gets balance of aSTETH (0x1982b2F5814301d4e9a8b0201555376e62F82428) balance if icETH
  // t1 = gets avdWETH (0xF63B34710400CAd3e044cFfDcAb00a0f32E33eCf) balance if icETH
  // levRatio = t0 / (t0-t1)

  //netYield (levRatio - 1) * (stETH yield [from lido] - ethBorrowRate) + stETH yield - 0.009
  // need stETH yield and eth borrow rate

  // ethBorrowRate: [currentVariableBorrowRate] = LendingPool.getReserveData(asset.address)
  return
}
