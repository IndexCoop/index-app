import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      'x-forwarded-for': req.headers.get('x-forwarded-for'),
      'x-real-ip': req.headers.get('x-real-ip'),
      'x-vercel-country': req.headers.get('x-vercel-ip-country'),
      'cf-connecting-ip': req.headers.get('cf-connecting-ip'),
      'cf-ipcountry': req.headers.get('cf-ipcountry'),
    })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
