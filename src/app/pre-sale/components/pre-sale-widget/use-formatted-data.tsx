import { formatUnits } from 'viem'
import { useDeposit } from '../../providers/deposit-provider'

export function useFormattedData() {
  const { preSaleCurrencyToken, preSaleToken, tvl, userBalance } = useDeposit()
  return {
    tvl: `${formatUnits(tvl, preSaleToken.decimals)} ${preSaleCurrencyToken.symbol}`,
    userBalance: `${formatUnits(userBalance, preSaleToken.decimals)} ${preSaleCurrencyToken.symbol}`,
  }
}
