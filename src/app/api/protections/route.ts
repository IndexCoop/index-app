import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // FIXME: Update hostname
  try {
    console.log(req.headers)
    const res = await fetch(
      'https://api-pr-29-80wy.onrender.com/api/v2/protections',
      {
        headers: {
          ...req.headers,
          'cf-ipcountry':
            req.headers.get('cf-ipcountry') ??
            req.headers.get('x-vercel-ip-country') ??
            undefined,
        },
      },
    )
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
