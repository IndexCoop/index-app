import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { PostApiV2UserAddress200 } from '@/gen'
import { getOrCreateUser } from '@/lib/actions/user'

export const userMetadataAtom = atomWithStorage<PostApiV2UserAddress200 | null>(
  'userMetadata',
  null,
)

export const fetchUserAtom = atom(
  null,
  async (_, set, params: { address: string; referredBy?: string | null }) => {
    try {
      const { address, referredBy } = params
      const { data, status } = await getOrCreateUser(address, referredBy)
      if (status === 200 && !('error' in data)) {
        set(userMetadataAtom, data)
      }
    } catch (e) {
      console.error('Failed to fetch user:', e)
    }
  },
)
