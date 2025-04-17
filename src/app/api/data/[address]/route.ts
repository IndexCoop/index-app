import { type NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> },
) {
  try {
    const { searchParams } = new URL(req.url)
    const { address } = await params
    const url = `https://api.indexcoop.com/v2/data/${address}?${searchParams.toString()}`
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.INDEX_COOP_API_V2_KEY,
      } as HeadersInit,
    })
    const json = await res.json()
    return NextResponse.json(json, { status: 200 })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
