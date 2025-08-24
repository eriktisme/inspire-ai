import { createConnection } from '@internal/database/connection'
import { env } from '@/env'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { users } from '@internal/database/schema'
import { eq } from 'drizzle-orm'
import { UpdateProfileBodySchema } from '@/features/account-profile'
import type { PgUpdateSetSource } from 'drizzle-orm/pg-core'

const connection = createConnection(env.DATABASE_URL)

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json(
      {
        code: 'not_authorized',
        statusCode: 401,
      },
      {
        status: 401,
      }
    )
  }

  const [user] = await connection
    .select()
    .from(users)
    .where(eq(users.id, userId))

  return NextResponse.json(
    {
      phoneNumber: user.phoneNumber,
    },
    { status: 200 }
  )
}

export async function PUT(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json(
      {
        code: 'not_authorized',
        statusCode: 401,
      },
      {
        status: 401,
      }
    )
  }

  const body = UpdateProfileBodySchema.safeParse(await request.json())

  if (!body.success) {
    return NextResponse.json(
      {
        code: 'invalid_request',
        statusCode: 400,
      },
      { status: 400 }
    )
  }

  const set: PgUpdateSetSource<typeof users> = {
    phoneNumber: body.data.phoneNumber,
  }

  await connection.update(users).set(set).where(eq(users.id, userId))

  return NextResponse.json(
    {
      phoneNumber: body.data.phoneNumber,
    },
    { status: 200 }
  )
}
