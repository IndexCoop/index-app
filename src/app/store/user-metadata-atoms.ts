import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { GetApiV2UserAddress200 } from '@/gen'

export const userMetadataAtom = atomWithStorage<GetApiV2UserAddress200 | null>(
  'userMetadata',
  null,
)

export const fetchUserAtom = atom(
  null,
  async (
    _,
    set,
    params: { address: string; referredBy?: string | null },
  ) => {
    try {
      const { address, referredBy } = params
      const url = referredBy
        ? `/api/user/${address}?referred_by=${encodeURIComponent(referredBy)}`
        : `/api/user/${address}`

      const user = await (await fetch(url)).json()
      set(userMetadataAtom, user)
    } catch (e) {
      console.error('Failed to fetch user:', e)
    }
  },
)
