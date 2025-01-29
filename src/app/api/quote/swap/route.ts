import { NextRequest, NextResponse } from 'next/server'

type IndexQuoteRequest = {
  chainId: string
  account: string
  inputToken: string
  outputToken: string
  inputAmount: string
  slippage: string
}

export async function POST(req: NextRequest) {
  try {
    const request: IndexQuoteRequest = await req.json()
    const query = new URLSearchParams(request).toString()
    const url = `https://api.indexcoop.com/v2/quote/swap?${query}`
    console.log(url)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.INDEX_COOP_API_V2_KEY,
      } as HeadersInit,
    })

    const quote = await response.json()

    if (!quote) {
      return NextResponse.json(
        { message: 'No swap quote found.' },
        { status: 404 },
      )
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}
