import { utils } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { useContractCall, useTokenBalance } from '@usedapp/core'

import { fromWei, safeDiv, toWei } from 'utils'
import { AAVE_LENDING_POOL_ABI } from 'utils/abi/AaveLendingPool'
import { LIDO_ORACLE_ABI } from 'utils/abi/LidoOracle'

const icETHAddress = '0x7C07F7aBe10CE8e33DC6C5aD68FE033085256A84'
const aSTETHAddress = '0x1982b2F5814301d4e9a8b0201555376e62F82428'
const avdWETHAddress = '0xF63B34710400CAd3e044cFfDcAb00a0f32E33eCf'
const aaveLendingPoolAddress = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9'
const lidoOracleAddress = '0x442af784A788A5bd6F42A01Ebe9F287a871243fb'
const WETHAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

const aaveLendingPoolInterface = new utils.Interface(AAVE_LENDING_POOL_ABI)
const lidoOracleInterface = new utils.Interface(LIDO_ORACLE_ABI)

/**
 * Get's the current APY on icETH based on math below
 *
 * stETHRate = (postTotalPooledEther - preTotalPooledEther) * secondsInYear / (preTotalPooledEther * timeElapsed)
 * ethBorrowRate = reserveData.currentVariableBorrowRate [e27 value, e25 gives us the rate in %, later multiplied by 100 to balance out]
 * t0 = aSTETH balance of icETH
 * t1 = avdWETH balance of icETH
 * leverageRatio = t0 / (t0-t1)
 * apy = (leverageRatio - 1) * (stETHRate - ethBorrowRate) + stETHRate - 0.009
 */
export const useIcEthApy = (): { apy: BigNumber } => {
  const aSTETHBalance =
    useTokenBalance(aSTETHAddress, icETHAddress) ?? BigNumber.from(0)
  const avdWETHBalance =
    useTokenBalance(avdWETHAddress, icETHAddress) ?? BigNumber.from(0)

  const [reserveData] =
    useContractCall({
      abi: aaveLendingPoolInterface,
      address: aaveLendingPoolAddress,
      method: 'getReserveData',
      args: [WETHAddress],
    }) ?? []

  const [postTotalPooledEther, preTotalPooledEther, timeElapsed] =
    useContractCall({
      abi: lidoOracleInterface,
      address: lidoOracleAddress,
      method: 'getLastCompletedReportDelta',
      args: [],
    }) ?? []

  if (
    reserveData === undefined ||
    postTotalPooledEther === undefined ||
    preTotalPooledEther === undefined ||
    timeElapsed === undefined
  )
    return { apy: BigNumber.from(0) }

  if (
    aSTETHBalance.isZero() ||
    aSTETHBalance.isNegative() ||
    avdWETHBalance.isZero() ||
    avdWETHBalance.isNegative()
  ) {
    return { apy: BigNumber.from(0) }
  }

  /* stETHRate = (postTotalPooledEther - preTotalPooledEther) * secondsInYear / (preTotalPooledEther * timeElapsed) */
  const secondsInYear = toWei('31556952', 18)
  const stEthAPR = safeDiv(
    BigNumber.from(postTotalPooledEther)
      .sub(BigNumber.from(preTotalPooledEther))
      .mul(BigNumber.from(secondsInYear))
      .mul(100),
    preTotalPooledEther.mul(timeElapsed)
  )

  const e18 = BigNumber.from(10).pow(18)
  const ethBorrowRate = fromWei(reserveData.currentVariableBorrowRate, 25).mul(
    e18
  )

  /* leverageRatio = t0 / (t0-t1) */
  const leverageRatio = safeDiv(
    aSTETHBalance,
    aSTETHBalance.sub(avdWETHBalance)
  ).mul(e18)

  /* apy = (levRatio - 1) * (stETH yield [1] - ethBorrowRate [2]) + stETH yield - 0.009 */
  const apy = leverageRatio
    .sub(1)
    .mul(stEthAPR.sub(ethBorrowRate))
    .add(stEthAPR.sub(toWei('0.009')))
    .div(e18)
    .abs()

  return { apy }
}
