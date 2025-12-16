import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { getApiV2Protections } from '@/gen'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address') ?? undefined

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

    return NextResponse.json(data)
  } catch (e) {
    console.error('Caught protections error', e)
    return NextResponse.json({
      isForbiddenAddress: false,
      isRestrictedCountry: false,
      isUsingVpn: false,
      isNewUser: false,
    })
  }
}
