import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params

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
