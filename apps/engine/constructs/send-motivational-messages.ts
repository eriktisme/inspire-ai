import { Construct } from 'constructs'
import { type EventBus } from 'aws-cdk-lib/aws-events'
import { Stack } from '@internal/cdk-utils/stack'
import { EventConsumer } from '@internal/cdk-utils/event-consumer'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'

interface Props {
  databaseUrl: string
  eventBus: EventBus
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
        },
      },
      eventBus: props.eventBus,
      eventPattern: {
        detailType: ['message.created'],
      },
      eventSourceProps: {
        batchSize: 10,
      },
    })

    handler.addToRolePolicy(
      new PolicyStatement({
        actions: ['sns:Publish'],
        resources: ['*'],
      })
    )

    props.eventBus.grantPutEventsTo(handler)
  }
}
