import type { Construct } from 'constructs'
import type { StackProps } from '@internal/cdk-utils/stack'
import { Stack } from '@internal/cdk-utils/stack'
import { Archive, EventBus } from 'aws-cdk-lib/aws-events'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'
import { PersistEvents } from '../constructs/persist-events'

export interface EngineProps extends StackProps {
  //
}

export class Engine extends Stack {
  constructor(scope: Construct, id: string, props: EngineProps) {
    super(scope, id, props)

    if (!props.env?.region) {
      throw new Error('Region is required in the environment configuration.')
    }

    const eventBus = new EventBus(this, 'event-bus', {
      eventBusName: `${props.env.region}-${props.stage}-${props.projectName}-event-bus`,
    })

    new Archive(this, 'event-bus-archive', {
      sourceEventBus: eventBus,
      eventPattern: {
        source: [
          {
            prefix: '',
          },
        ] as any[],
      },
    })

    new StringParameter(this, 'event-bus-arn', {
      parameterName: `/${props.env.region}/${props.stage}/${props.projectName}/event-bus-arn`,
      stringValue: eventBus.eventBusArn,
    })

    new PersistEvents(this, 'persist-events', {
      eventBus,
    })
  }
}
