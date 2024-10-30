import prisma from '@/lib/prisma'
import { Transaction } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

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
    return NextResponse.json(
      {
        error: 'Failed to create transaction.',
      },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
