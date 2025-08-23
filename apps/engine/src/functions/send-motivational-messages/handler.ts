import { Tracer } from '@aws-lambda-powertools/tracer'
import { Logger } from '@aws-lambda-powertools/logger'
import z from 'zod'
import { MessageCreatedEvent } from '@internal/events-schema/message'
import type { SQSEvent } from 'aws-lambda'
import { createConnection } from '@internal/database/connection'
import { users } from '@internal/database/schema'
import { inArray } from 'drizzle-orm'
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns'

const tracer = new Tracer()

const logger = new Logger()

const ConfigSchema = z.object({
  databaseUrl: z.string().min(1),
})

const config = ConfigSchema.parse({
  databaseUrl: process.env.DATABASE_URL,
})

const client = tracer.captureAWSv3Client(new SNSClient())

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

    const message = await client.send(
      new PublishCommand({
        Message: data.message,
        PhoneNumber: user.phoneNumber,
      })
    )

    if (!message.MessageId) {
      logger.error('Failed to send message', { userId: user.id })
    }
  }
}
