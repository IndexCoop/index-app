import { User } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { address }: Pick<User, 'address'> = await req.json()

  if (!address) {
    return NextResponse.json(
      { error: 'Bad Request: Missing Parameters.' },
      { status: 400 },
    )
  }

  let user = await prisma.user.findUnique({
    where: { address },
  })

  const last_connected = new Date().toISOString()

  if (user) {
    user = await prisma.user.update({
      where: { address },
      data: { last_connected },
    })
  } else {
    user = await prisma.user.create({
      data: {
        address,
        last_connected,
      },
    })
  }

  return NextResponse.json(user, { status: 200 })
}
