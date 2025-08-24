import { UpdatePreferenceBodySchema } from '@/features/dashboard'
import { createConnection } from '@internal/database/connection'
import { env } from '@/env'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { preferences } from '@internal/database/schema'
import { eq } from 'drizzle-orm'
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

  const [preference] = await connection
    .select()
    .from(preferences)
    .where(eq(preferences.userId, userId))

  /**
   * This case should not happen as we create a preference row when the user is created.
   */
  if (!preference) {
    return NextResponse.json(
      {
        goals: [],
        themes: [],
        frequency: 'daily',
      },
      { status: 200 }
    )
  }

  return NextResponse.json(
    {
      goals: preference.goals,
      themes: preference.themes,
      frequency: preference.frequency,
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

  const body = UpdatePreferenceBodySchema.safeParse(await request.json())

  if (!body.success) {
    return NextResponse.json(
      {
        code: 'bad_request_error',
        statusCode: 400,
      },
      { status: 400 }
    )
  }

  const set: PgUpdateSetSource<typeof preferences> = {
    //
  }

  if (body.data.goals) {
    set.goals = body.data.goals
  }

  if (body.data.themes) {
    set.themes = body.data.themes
  }

  if (body.data.frequency) {
    set.frequency = body.data.frequency
  }

  if (Object.keys(set).length === 0) {
    return NextResponse.json(
      {
        code: 'invalid_request',
        statusCode: 400,
      },
      { status: 400 }
    )
  }

  const [preference] = await connection
    .update(preferences)
    .set(set)
    .where(eq(preferences.userId, userId))
    .returning()

  return NextResponse.json(
    {
      goals: preference.goals,
      themes: preference.themes,
      frequency: preference.frequency,
    },
    { status: 200 }
  )
}
