import type { EventBridgeEvent } from 'aws-lambda'

type Metadata = {
  userId: string
}

type Data = {
  message: string
}

type MessageCreatedEventDetail = {
  data: Data
  metadata: Metadata
}

export class MessageCreatedEvent {
  static toEventBridgeEventDetail = (
    data: Data,
    metadata: Metadata
  ): EventBridgeEvent<
    'message.created',
    MessageCreatedEventDetail
  >['detail'] => {
    return {
      data,
      metadata,
    }
  }

  static fromEventBridgeEvent = (
    event: EventBridgeEvent<
      'workout.activity.created',
      MessageCreatedEventDetail
    >
  ): MessageCreatedEventDetail => {
    return event.detail
  }
}
