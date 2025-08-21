import type { EventBridgeEvent } from 'aws-lambda'

type Data = {
  message: string
}

type MessageCreatedEventDetail = {
  data: Data
}

export class MessageCreatedEvent {
  static toEventBridgeEventDetail = (
    data: Data
  ): EventBridgeEvent<
    'message.created',
    MessageCreatedEventDetail
  >['detail'] => {
    return {
      data,
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
