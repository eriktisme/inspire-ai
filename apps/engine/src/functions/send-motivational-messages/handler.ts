import { Tracer } from '@aws-lambda-powertools/tracer'
import { Logger } from '@aws-lambda-powertools/logger'
import z from 'zod'
import { MessageCreatedEvent } from '@internal/events-schema/message'
import type { SQSEvent } from 'aws-lambda'
import twilio from 'twilio'
import { createConnection } from '@internal/database/connection'
import { users } from '@internal/database/schema'
import { inArray } from 'drizzle-orm'

new Tracer()

const logger = new Logger()

const ConfigSchema = z.object({
  accountSid: z.string().min(1),
  authToken: z.string().min(1),
  databaseUrl: z.string().min(1),
  phoneNumber: z.string().min(1),
})

const config = ConfigSchema.parse({
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  databaseUrl: process.env.DATABASE_URL,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER,
})

const client = twilio(config.accountSid, config.authToken)

const connection = createConnection(config.databaseUrl)

/**
 * This handler is responsible for sending the inspirational quotes.
 */
export const buildHandler = async (event: SQSEvent) => {
  const userIds = new Set<string>()

  /**
   * Get the user IDs from the events metadata
   */
  for (const record of event.Records) {
    const { metadata } = MessageCreatedEvent.fromEventBridgeEvent(
      JSON.parse(record.body)
    )

    userIds.add(metadata.userId)
  }

  /**
   * Fetch all the phone numbers of users that are in the batch
   */
  const result = await connection
    .select({
      id: users.id,
      phoneNumber: users.phoneNumber,
    })
    .from(users)
    .where(inArray(users.id, Array.from(userIds)))

  logger.info(`Sending messages to ${result.length} users`)

  for (const record of event.Records) {
    const { data, metadata } = MessageCreatedEvent.fromEventBridgeEvent(
      JSON.parse(record.body)
    )

    const user = result.find((u) => u.id === metadata.userId)

    if (!user || !user.phoneNumber) {
      logger.warn('We currently only support sending messages using SMS')

      return
    }

    try {
      const response = await client.messages.create({
        body: data.message,
        from: config.phoneNumber,
        to: user.phoneNumber,
      })

      if (response.status === 'failed' || response.status === 'undelivered') {
        logger.error('Message failed to send', {
          user: user.id,
          error: response.errorMessage,
        })
      }
    } catch (error) {
      logger.error('Failed to send message', {
        error: (error as Error).message,
      })

      return
    }
  }
}
