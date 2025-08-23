import { MotivatorService } from '@/services/agents'
import { Tracer } from '@aws-lambda-powertools/tracer'
import { Logger } from '@aws-lambda-powertools/logger'
import OpenAI from 'openai'
import z from 'zod'
import type { PutEventsRequestEntry } from '@aws-sdk/client-eventbridge'
import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge'
import { MessageCreatedEvent } from '@internal/events-schema/message'
import { createConnection } from '@internal/database/connection'
import { preferences, users } from '@internal/database/schema'
import { eq, ne } from 'drizzle-orm'

const tracer = new Tracer()

const logger = new Logger()

const eventBridgeClient = tracer.captureAWSv3Client(new EventBridgeClient())

const ConfigSchema = z.object({
  databaseUrl: z.string().min(1),
  eventBusName: z.string().min(1),
  openAiKey: z.string().min(1),
})

const config = ConfigSchema.parse({
  databaseUrl: process.env.DATABASE_URL,
  eventBusName: process.env.EVENT_BUS_NAME,
  openAiKey: process.env.OPENAI_API_KEY,
})

const connection = createConnection(config.databaseUrl)

const service = new MotivatorService({
  openai: new OpenAI({
    apiKey: config.openAiKey,
  }),
  logger,
})

/**
 * This handler is responsible for generating personalized inspirational quotes.
 */
export const buildHandler = async () => {
  /**
   * Fetch all the users that are not paused
   *
   * Future improvements:
   *  - Handle frequency (daily, weekly, monthly)
   *  - Handle timezones
   */
  const result = await connection
    .select({
      id: users.id,
      goals: preferences.goals,
      themes: preferences.themes,
    })
    .from(users)
    .innerJoin(preferences, eq(users.id, preferences.userId))
    .where(ne(preferences.frequency, 'paused'))

  logger.info(`Generating motivational messages for ${result.length} users`)

  const events: PutEventsRequestEntry[] = []

  /**
   * Future improvements:
   *
   * - Add batching to avoid hitting rate limits
   * - Add retry logic for failed requests
   */
  for (const row of result) {
    const message = await service.call({
      goals: row.goals,
      themes: row.themes,
    })

    if (!message) {
      logger.error('Failed to generate motivational message')

      continue
    }

    events.push({
      Source: 'engine',
      DetailType: 'message.created',
      Detail: JSON.stringify(
        MessageCreatedEvent.toEventBridgeEventDetail(
          {
            message,
          },
          {
            userId: row.id,
          }
        )
      ),
      EventBusName: config.eventBusName,
    })
  }

  await eventBridgeClient.send(
    new PutEventsCommand({
      Entries: events,
    })
  )
}
