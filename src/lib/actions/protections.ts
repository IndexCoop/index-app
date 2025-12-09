'use server'

import { headers } from 'next/headers'

import { getApiV2Protections, GetApiV2Protections200 } from '@/gen'

type ProtectionsResponse = GetApiV2Protections200

export async function getProtections(
  address?: string,
): Promise<ProtectionsResponse> {
  try {
    const headersList = headers()

    const { data } = await getApiV2Protections(
      address ? { address } : undefined,
      {
        headers: {
          'ic-ip-address':
            headersList.get('cf-connecting-ip') ??
            headersList.get('x-forwarded-for') ??
            '',
          'ic-ip-country':
            headersList.get('cf-ipcountry') ??
            headersList.get('x-vercel-ip-country') ??
            '',
        },
      },
    )

    return data
  } catch (e) {
    console.error('Caught protections error', e)
    return {
      isForbiddenAddress: false,
      isRestrictedCountry: false,
      isUsingVpn: false,
      isNewUser: false,
    }
  }
}
