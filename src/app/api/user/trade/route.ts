import { Trade } from '@prisma/client'
import * as Sentry from '@sentry/nextjs'
import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const trade: Trade = await req.json()

  if (!trade) {
    return NextResponse.json(
      { error: 'Bad Request: Missing Parameters.' },
      { status: 400 },
    )
  }

  try {
    await prisma.trade.create({
      data: trade,
    })
  } catch (e) {
    Sentry.captureMessage('Transaction creation in database failed', {
      extra: {
        e,
        trade,
      },
    })

    return NextResponse.json(
      {
        error: 'Failed to create transaction.',
      },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
