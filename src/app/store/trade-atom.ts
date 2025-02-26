import { atomWithReset } from 'jotai/utils'
import { TransactionReceipt } from 'viem'

import { PostApiV2Trade200 } from '@/gen'

export const tradeAtom = atomWithReset<
  | (PostApiV2Trade200 & {
      status: 'unknown' | 'pending' | TransactionReceipt['status']
    })
  | null
>(null)
