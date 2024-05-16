import { useAccount } from 'wagmi'

import {
  IndexCoopBitcoin2xIndex,
  IndexCoopBitcoin3xIndex,
  IndexCoopEthereum2xIndex,
  IndexCoopEthereum3xIndex,
  IndexCoopInverseBitcoinIndex,
  IndexCoopInverseEthereumIndex,
} from '@/constants/tokens'
import { useBalances } from '@/lib/hooks/use-balance'

const leverageTokenAddresses = [
  IndexCoopBitcoin2xIndex,
  IndexCoopBitcoin3xIndex,
  IndexCoopEthereum2xIndex,
  IndexCoopEthereum3xIndex,
  IndexCoopInverseBitcoinIndex,
  IndexCoopInverseEthereumIndex,
].map((token) => token.arbitrumAddress ?? '')

export function OpenPositions() {
  const { address } = useAccount()
  const balances = useBalances(address, leverageTokenAddresses)

  return (
    <div className='border-ic-gray-600 w-full rounded-3xl border bg-[#1C2C2E]'>
      <h3 className='text-ic-white p-6 text-[14px] font-bold md:p-8'>
        Open Positions
      </h3>
      {balances.length > 0 && (
        <div className='p-6'>
          {balances.map((balance) => (
            <div key={balance.token}>{balance.toString()}</div>
          ))}
        </div>
      )}
    </div>
  )
}
