import { utils } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { useContractCall, useTokenBalance } from '@usedapp/core'

import { displayFromWei, preciseDiv, toWei } from 'utils'
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
 * Get's the current APY on icETH
 */
export const useIcEthApy = (): { apy: BigNumber; apyFormatted: string } => {
  const aSTETHBalance =
    useTokenBalance(aSTETHAddress, icETHAddress) ?? BigNumber.from(0)
  const avdWETHBalance =
    useTokenBalance(WETHAddress, icETHAddress) ?? BigNumber.from(0)

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

  console.log(
    'reserveData',
    reserveData.currentVariableBorrowRate.toString(),
    reserveData
  )
  console.log('postTotalPooledEther', postTotalPooledEther.toString())
  console.log('preTotalPooledEther', preTotalPooledEther.toString())
  console.log('timeElapsed', timeElapsed)

  if (
    postTotalPooledEther === undefined ||
    preTotalPooledEther === undefined ||
    timeElapsed === undefined
  )
    return { apy: BigNumber.from(0), apyFormatted: 'n/a' }

  const ethBorrowRate = reserveData.currentVariableBorrowRate

  // stETH APR = (postTotalPooledEther - preTotalPooledEther) * secondsInYear / (preTotalPooledEther * timeElapsed)
  const secondsInYear = BigNumber.from('31556952')
  const stEthAPR = preciseDiv(
    postTotalPooledEther.sub(preTotalPooledEther).mul(secondsInYear),
    preTotalPooledEther.mul(timeElapsed)
  )

  console.log('BAL', aSTETHBalance.toString(), avdWETHBalance.toString())
  if (aSTETHBalance.isZero() || avdWETHBalance.isZero()) {
    return { apy: BigNumber.from(0), apyFormatted: 'n/a' }
  }

  // t0 = gets balance of aSTETH (0x1982b2F5814301d4e9a8b0201555376e62F82428) balance of icETH token contract
  // t1 = gets avdWETH (0xF63B34710400CAd3e044cFfDcAb00a0f32E33eCf) balance of icETH token contract
  // levRatio = t0 / (t0-t1)
  const leverageRatio = preciseDiv(
    aSTETHBalance,
    aSTETHBalance.sub(avdWETHBalance)
  )
  console.log(leverageRatio.toString(), 'leverageRatio')

  // netYield = (levRatio - 1) * (stETH yield [1] - ethBorrowRate [2]) + stETH yield - 0.009
  const yieldBorrowRate = stEthAPR
    .sub(ethBorrowRate)
    .add(stEthAPR.sub(toWei('0.009')))
  const netYield = leverageRatio.sub(1).mul(yieldBorrowRate)

  // [1] stETH yield: https://docs.lido.fi/contracts/lido-oracle/#getlastcompletedreportdelta
  // can be used to calculate stETH yield (APR) over time period
  // [2] ethBorrowRate: [currentVariableBorrowRate] = LendingPool.getReserveData(asset.address) <- aave v2 mainnet lendingpool contract https://docs.aave.com/developers/v/2.0/the-core-protocol/lendingpool

  const formattedNetYield = displayFromWei(netYield, 2, 18) ?? '0.00'
  console.log(`${formattedNetYield}%`)
  return { apy: netYield, apyFormatted: `${formattedNetYield}%` }
}
