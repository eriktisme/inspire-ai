import { Construct } from 'constructs'
import { Rule, Schedule, type EventBus } from 'aws-cdk-lib/aws-events'
import { Duration } from 'aws-cdk-lib'
import { EventConsumer } from '@internal/cdk-utils/event-consumer'
import type { OpenAIProps } from '@internal/cdk-utils/types'
import { Stack } from '@internal/cdk-utils/stack'
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets'
import { NodeJSLambda } from '@internal/cdk-utils/lambda'

interface Props {
  eventBus: EventBus
  openai: OpenAIProps
}

export class GenerateMotivationalMessage extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id)

    const stack = Stack.getStack(this)

    const timeout = Duration.minutes(10)

    const handler = new NodeJSLambda(this, 'consumer', {
      serviceName: stack.serviceName,
      entry: 'src/functions/generate-motivational-message/index.ts',
      environment: {
        OPENAI_API_KEY: props.openai.apiKey,
        EVENT_BUS_NAME: props.eventBus.eventBusName,
      },
      timeout,
    })

    props.eventBus.grantPutEventsTo(handler)

    /**
     * This rule triggers the Lambda function every day at 8 AM UTC.
     */
    new Rule(this, 'Rule', {
      schedule: Schedule.cron({
        minute: '0',
        hour: '7',
      }),
      targets: [new LambdaFunction(handler)],
    })
  }
}
