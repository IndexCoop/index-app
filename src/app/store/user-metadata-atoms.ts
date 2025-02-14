import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { GetApiV2UserAddress200 } from '@/gen'

export const userMetadataAtom = atomWithStorage<GetApiV2UserAddress200 | null>(
  'userMetadata',
  null,
)

export const fetchUserAtom = atom(null, async (_, set, address: string) => {
  try {
    const user = await (await fetch(`/api/user/${address}`)).json()
    set(userMetadataAtom, user)
  } catch (e) {
    console.error('Failed to fetch user:', e)
  }
})
