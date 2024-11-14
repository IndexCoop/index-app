import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    console.log(`x-forwarded-for [${req.headers.get('x-forwarded-for')}]`)
    console.log(
      `x-vercel-forwarded-for [${req.headers.get('x-vercel-forwarded-for')}]`,
    )
    console.log(`x-real-ip [${req.headers.get('x-real-ip')}]`)
    console.log(
      `x-vercel-ip-country [${req.headers.get('x-vercel-ip-country')}]`,
    )
    console.log('req.headers.keys', req.headers.keys())

    return NextResponse.json({ restricted: true })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
