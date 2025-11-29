import { NextRequest, NextResponse } from 'next/server'

import { getApiV2Protections } from '@/gen'

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get('address') ?? undefined

    const ipAddress =
      req.headers.get('cf-connecting-ip') ??
      req.headers.get('x-forwarded-for') ??
      ''
    const ipCountry =
      req.headers.get('cf-ipcountry') ??
      req.headers.get('x-vercel-ip-country') ??
      ''

    const res = await getApiV2Protections(
      { address },
      {
        headers: {
          ...Object.fromEntries(req.headers.entries()),
          'ic-ip-address': ipAddress,
          'ic-ip-country': ipCountry,
        },
      },
    )

    const { isForbiddenAddress, isRestrictedCountry, isUsingVpn } = res.data

    return NextResponse.json({
      isForbiddenAddress,
      isRestrictedCountry,
      isUsingVpn,
    })
  } catch (e) {
    console.error('Caught protections error', e)
    return NextResponse.json({
      isForbiddenAddress: false,
      isRestrictedCountry: false,
      isUsingVpn: false,
    })
  }
}
