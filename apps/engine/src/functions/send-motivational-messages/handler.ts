import { Tracer } from '@aws-lambda-powertools/tracer'
import { Logger } from '@aws-lambda-powertools/logger'
import z from 'zod'
import { MessageCreatedEvent } from '@internal/events-schema/message'
import type { SQSEvent } from 'aws-lambda'
import twilio from 'twilio'
import { createConnection } from '@internal/database/connection'
import { users, preferences } from '@internal/database/schema'
import { ne, eq } from 'drizzle-orm'

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
  /**
   * Fetch all the users that are not paused,
   * we will send them a motivational message
   *
   * Future improvements:
   *  - Handle multiple times per day
   *  - Handle timezones
   *  - Once messages are personalized, we just need to send
   */
  const result = await connection
    .select({
      id: users.id,
      phoneNumber: users.phoneNumber,
    })
    .from(users)
    .leftJoin(preferences, eq(users.id, preferences.userId))
    .where(ne(preferences.frequency, 'paused'))

  logger.info(`Sending messages to ${result.length} users`)

  for (const record of event.Records) {
    const { data } = MessageCreatedEvent.fromEventBridgeEvent(
      JSON.parse(record.body)
    )

    for (const user of result) {
      if (!user.phoneNumber) {
        logger.warn('We currently only support sending messages using SMS')

        return
      }

      try {
        /**
         * TODO:
         *
         *  - Verify the phone number is in the expected format ([E.164](https://www.twilio.com/docs/glossary/what-e164) format)
         *  - Handle failed messages,
         *    not sure if the library throws,
         *    or returns in the promise the message status
         */
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
}
