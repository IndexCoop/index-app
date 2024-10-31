import { Transaction } from '@prisma/client'
import * as Sentry from '@sentry/nextjs'
import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const transaction: Transaction = await req.json()

  if (!transaction) {
    return NextResponse.json(
      { error: 'Bad Request: Missing Parameters.' },
      { status: 400 },
    )
  }

  try {
    await prisma.transaction.create({
      data: transaction,
    })
  } catch (e) {
    Sentry.captureMessage('Transaction creation in database failed', {
      extra: {
        e,
        transaction,
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
