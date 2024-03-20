import { formatUnits } from 'viem'

import { useFormattedBalance } from '@/components/swap/hooks/use-swap/use-formatted-balance'
import { useWallet } from '@/lib/hooks/use-wallet'

import { useDeposit } from '../../providers/deposit-provider'
import { usePresaleData } from '../../providers/presale-provider'

export function useFormattedData() {
  const { address } = useWallet()
  const { preSaleCurrencyToken, preSaleToken } = useDeposit()
  const { balance } = useFormattedBalance(preSaleToken, address)
  const { balanceFormatted: currencyBalanceFormatted } = useFormattedBalance(
    preSaleCurrencyToken,
    address,
  )
  const { formatted } = usePresaleData(preSaleToken.symbol)
  return {
    currencyBalance: `${currencyBalanceFormatted}`,
    tvl: formatted.tvl,
    // As the conversion is 1-1 we can use the pre sale token balance 1-1 to show
    // how much the user deposited in the pre sale currency token
    userBalance: `${formatUnits(balance, preSaleToken.decimals)} ${preSaleCurrencyToken.symbol}`,
  }
}
