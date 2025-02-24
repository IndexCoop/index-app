import { GetApiV2UserAddressPositions200 } from '@/gen'
import { atomWithReset } from 'jotai/utils'
import { TransactionReceipt } from 'viem'

export const tradeAtom = atomWithReset<
  | (GetApiV2UserAddressPositions200[number]['trade'] & {
      status: 'unknown' | 'pending' | TransactionReceipt['status']
    })
  | null
>(null)
