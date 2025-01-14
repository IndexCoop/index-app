import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // FIXME: Update hostname
  try {
    const res = await fetch(
      'https://api-pr-29-80wy.onrender.com/api/v2/protections',
      {
        headers: {
          'cf-ipcountry':
            req.headers.get('cf-ipcountry') ??
            req.headers.get('x-vercel-ip-country') ??
            '',
          'cf-connecting-ip':
            req.headers.get('cf-connecting-ip') ??
            req.headers.get('x-forwarded-for') ??
            '',
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
      isRstrictedCountry: false,
      isUsingVpn: false,
    })
  }
}
