import { NextResponse } from 'next/server'
import { MotivatorService } from '@internal/agents/motivator'
import OpenAI from 'openai'
import { env } from '@/env'
import { createConnection } from '@internal/database/connection'
import { auth } from '@clerk/nextjs/server'
import { preferences } from '@internal/database/schema'
import { eq } from 'drizzle-orm'

const service = new MotivatorService({
  openai: new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  }),
})

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
   * Default preview if no preference is set
   */
  if (
    !preference ||
    (preference.goals.length === 0 && preference.themes.length === 0)
  ) {
    return NextResponse.json(
      {
        message: 'You are doing great! Keep up the good work!',
      },
      { status: 200 }
    )
  }

  const message = await service.call({
    goals: preference.goals,
    themes: preference.themes,
  })

  if (!message) {
    return NextResponse.json(
      {
        code: 'internal_error',
        statusCode: 500,
      },
      {
        status: 500,
      }
    )
  }

  return NextResponse.json(
    {
      message,
    },
    {
      status: 200,
    }
  )
}
