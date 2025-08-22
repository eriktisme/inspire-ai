import { Construct } from 'constructs'
import { type EventBus } from 'aws-cdk-lib/aws-events'
import type { TwilioProps } from '@internal/cdk-utils/types'
import { Stack } from '@internal/cdk-utils/stack'
import { EventConsumer } from '@internal/cdk-utils/event-consumer'

interface Props {
  databaseUrl: string
  eventBus: EventBus
  twilio: TwilioProps
}

export class SendMotivationalMessages extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id)

    const stack = Stack.getStack(this)

    const { handler } = new EventConsumer(this, 'event-consumer', {
      handlerProps: {
        serviceName: stack.serviceName,
        entry: 'src/functions/send-motivational-messages/index.ts',
        environment: {
          DATABASE_URL: props.databaseUrl,
          EVENT_BUS_NAME: props.eventBus.eventBusName,
          TWILIO_ACCOUNT_SID: props.twilio.accountSid,
          TWILIO_AUTH_TOKEN: props.twilio.authToken,
          TWILIO_PHONE_NUMBER: props.twilio.phoneNumber,
        },
      },
      eventBus: props.eventBus,
      eventPattern: {
        detailType: ['message.created'],
      },
    })

    props.eventBus.grantPutEventsTo(handler)
  }
}
