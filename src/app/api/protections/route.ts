import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get('address')
    const path = address
      ? `/v2/protections?${new URLSearchParams({ address }).toString()}`
      : '/v2/protections'
    const res = await fetch(`https://api.indexcoop.com${path}`, {
      headers: {
        ...req.headers,
        'ic-ip-address':
          req.headers.get('cf-connecting-ip') ??
          req.headers.get('x-forwarded-for') ??
          undefined,
        'ic-ip-country':
          req.headers.get('cf-ipcountry') ??
          req.headers.get('x-vercel-ip-country') ??
          undefined,
      },
    })
    const { isRestrictedCountry, isUsingVpn } = await res.json()

    return NextResponse.json({
      isRestrictedCountry,
      isUsingVpn,
    })
  } catch (e) {
    console.error('Caught protections error', e)
    return NextResponse.json({
      isRestrictedCountry: false,
      isUsingVpn: false,
    })
  }
}
