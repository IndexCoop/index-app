import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  const options = { message: 'hello' }
  return NextResponse.json({ options })
}
