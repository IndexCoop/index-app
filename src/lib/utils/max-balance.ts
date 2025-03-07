import { Token } from '@/constants/tokens'
import { GasData } from '@/lib/hooks/use-gas-data'

export function getMaxBalance(
  inputToken: Token,
  inputBalance: bigint,
  gasData: GasData,
): bigint {
  console.log(inputToken.symbol, inputToken.address, 'max')
  if (inputToken.symbol === 'ETH') {
    const gasLimit = BigInt(1_500_000)
    const gasCosts = gasLimit * gasData.maxFeePerGas
    const maxEthBalance = inputBalance - gasCosts * BigInt(2)
    return maxEthBalance
  }
  // If no ETH, we can always just use the full balance
  return inputBalance
}
