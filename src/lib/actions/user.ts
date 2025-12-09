'use server'

import {
  postApiV2UserAddress,
  PostApiV2UserAddressMutation,
  PostApiV2UserAddress200,
} from '@/gen'

type UserResult =
  | { data: PostApiV2UserAddress200; status: number }
  | { data: { error: string }; status: 500 }

export async function getOrCreateUser(
  address: string,
  referredBy?: string | null,
): Promise<UserResult> {
  try {
    const body = referredBy ? { referred_by: referredBy } : {}
    const { data: user, status } = await postApiV2UserAddress({ address }, body)

    return { data: user, status }
  } catch (e) {
    return {
      data: { error: (e as PostApiV2UserAddressMutation['Errors']).message },
      status: 500,
    }
  }
}
