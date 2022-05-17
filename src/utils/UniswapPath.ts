// Address sizes are a little different in 0x's `uniswapPath` than in Uniswap's Path.sol
// https://github.com/Uniswap/v3-periphery/blob/main/contracts/libraries/Path.sol
const ADDR_SIZE = 40
const FEE_SIZE = 6 // 0001f47

const hexToDecimal = (hex: string) => parseInt(hex, 16)

/**
 * Returns fees for pool (converts hex to decimal)
 *
 * @param path expects a path of 0x's `uniswapPath` which encodes pools and fees,
 * see an example below:
 * 0x2791bca1f2de4661ed88a30c99a7a9449aa841740001f47ceb23fd6bc0add59e62ac25578270cff1b9f619
 *
 * @returns an array of fees as numbers e.g. [500, 500]
 */
export function extractPoolFees(path: string): number[] {
  let fees: number[] = []
  // +2 for `0x` at beginning of path
  let rangeStart = ADDR_SIZE + 2
  let rangeEnd = rangeStart + FEE_SIZE
  while (path.length > rangeEnd) {
    const feeAsHex = path.slice(rangeStart, rangeEnd)
    const fee = hexToDecimal(feeAsHex)
    fees.push(fee)
    rangeStart = rangeEnd + ADDR_SIZE
    rangeEnd = rangeStart + FEE_SIZE
  }
  return fees
}
