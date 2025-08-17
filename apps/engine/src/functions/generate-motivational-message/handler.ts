import { MotivatorService } from '@/services/agents'
import { Tracer } from '@aws-lambda-powertools/tracer'
import { Logger } from '@aws-lambda-powertools/logger'
import OpenAI from 'openai'
import z from 'zod'
import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge'
import { MessageCreatedEvent } from '@internal/events-schema/message'

const tracer = new Tracer()

const logger = new Logger()

const eventBridgeClient = tracer.captureAWSv3Client(new EventBridgeClient())

const ConfigSchema = z.object({
  openAiKey: z.string().min(1),
  eventBusName: z.string().min(1),
})

const config = ConfigSchema.parse({
  openAiKey: process.env.OPENAI_API_KEY,
  eventBusName: process.env.EVENT_BUS_NAME,
})

const service = new MotivatorService({
  openai: new OpenAI({
    apiKey: config.openAiKey,
  }),
  logger,
})

/**
 * This handler is responsible for generating inspirational quotes.
 */
export const buildHandler = async () => {
  const message = await service.call({
    //
  })

  if (!message) {
    logger.error('Failed to generate motivational message')

    return
  }

  await eventBridgeClient.send(
    new PutEventsCommand({
      Entries: [
        {
          Source: 'engine',
          DetailType: 'message.created',
          Detail: JSON.stringify(
            MessageCreatedEvent.toEventBridgeEventDetail({
              message,
            })
          ),
          EventBusName: config.eventBusName,
        },
      ],
    })
  )
}
