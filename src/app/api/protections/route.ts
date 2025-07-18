import { NextRequest, NextResponse } from 'next/server'

import { getApiV2Protections } from '@/gen'

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get('address')

    const { data } = await getApiV2Protections(
      { address: address ?? undefined },
      {
        headers: {
          ...Object.fromEntries(req.headers.entries()),
          'ic-ip-address':
            req.headers.get('cf-connecting-ip') ??
            req.headers.get('x-forwarded-for') ??
            undefined,
          'ic-ip-country':
            req.headers.get('cf-ipcountry') ??
            req.headers.get('x-vercel-ip-country') ??
            undefined,
        },
      },
    )

    const { isForbiddenAddress, isRestrictedCountry, isNewUser, isUsingVpn } =
      data

    return NextResponse.json({
      isForbiddenAddress,
      isRestrictedCountry,
      isNewUser,
      isUsingVpn,
    })
  } catch (e) {
    console.error('Caught protections error', e)
    return NextResponse.json({
      isForbiddenAddress: false,
      isRestrictedCountry: false,
      isNewUser: false,
      isUsingVpn: false,
    })
  }
}
