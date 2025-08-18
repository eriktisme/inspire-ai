import { Tracer } from '@aws-lambda-powertools/tracer'
import { Logger } from '@aws-lambda-powertools/logger'
import z from 'zod'
import { MessageCreatedEvent } from '@internal/events-schema/message'
import type { SQSEvent } from 'aws-lambda'
import twilio from 'twilio'

new Tracer()

const logger = new Logger()

const ConfigSchema = z.object({
  accountSid: z.string().min(1),
  authToken: z.string().min(1),
  phoneNumber: z.string().min(1),
})

const config = ConfigSchema.parse({
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER,
})

const client = twilio(config.accountSid, config.authToken)

/**
 * This handler is responsible for sending the inspirational quotes.
 */
export const buildHandler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const { data } = MessageCreatedEvent.fromEventBridgeEvent(
      JSON.parse(record.body)
    )

    try {
      await client.messages.create({
        body: data.message,
        from: config.phoneNumber,
        to: '', // Replace with the recipient's phone number
      })
    } catch (error) {
      logger.error('Failed to send message', {
        error: (error as Error).message,
      })

      return
    }
  }
}
