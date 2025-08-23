import { UpdatePreferenceBodySchema } from '@/features/dashboard'
import { createConnection } from '@internal/database/connection'
import { env } from '@/env'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { preferences } from '@internal/database/schema'
import { eq } from 'drizzle-orm'

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
      },
      { status: 200 }
    )
  }

  return NextResponse.json(
    {
      goals: preference.goals,
      themes: preference.themes,
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

  const [preference] = await connection
    .update(preferences)
    .set({
      goals: body.data.goals,
      themes: body.data.themes,
    })
    .where(eq(preferences.userId, userId))
    .returning()

  return NextResponse.json(
    {
      goals: preference.goals,
      themes: preference.themes,
    },
    { status: 200 }
  )
}
