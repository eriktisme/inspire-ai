import { env } from '@/env'
import type { DeletedObjectJSON, UserJSON, WebhookEvent } from '@clerk/backend'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { createConnection } from '@internal/database/connection'
import { preferences, users } from '@internal/database/schema'
import { eq } from 'drizzle-orm'

const connection = createConnection(env.DATABASE_URL)

const handleUserCreated = async (data: UserJSON) => {
  const [user] = await connection
    .insert(users)
    .values({
      id: data.id,
      email: data.email_addresses.at(0)?.email_address ?? '',
      phoneNumber: data.phone_numbers.at(0)?.phone_number ?? '',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    })
    .returning()
    .onConflictDoNothing({
      target: users.id,
    })

  if (!user) {
    return new Response('Failed to create user', { status: 500 })
  }

  const [userPreferences] = await connection
    .insert(preferences)
    .values({
      userId: user.id,
      frequency: 'daily',
    })
    .returning()
    .onConflictDoNothing({
      target: users.id,
    })

  if (!userPreferences) {
    return new Response('Failed to create user preferences', { status: 500 })
  }

  return new Response('User created', { status: 201 })
}

const handleUserUpdated = async (data: UserJSON) => {
  await connection
    .update(users)
    .set({
      email: data.email_addresses.at(0)?.email_address ?? '',
      phoneNumber: data.phone_numbers.at(0)?.phone_number ?? '',
      updatedAt: new Date(data.updated_at),
    })
    .where(eq(users.id, data.id))

  return new Response('User updated', { status: 201 })
}

const handleUserDeleted = async (_: DeletedObjectJSON) => {
  return new Response('User deleted', { status: 201 })
}

export const POST = async (request: Request): Promise<Response> => {
  if (!env.CLERK_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Not configured', ok: false })
  }

  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  const payload = (await request.json()) as object
  const body = JSON.stringify(payload)

  const webhook = new Webhook(env.CLERK_WEBHOOK_SECRET)

  let event: WebhookEvent | undefined

  try {
    event = webhook.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch (error) {
    return new Response('Error occurred', {
      status: 400,
    })
  }

  const eventType = event.type

  let response: Response = new Response('', { status: 201 })

  switch (eventType) {
    case 'user.created': {
      response = await handleUserCreated(event.data)

      break
    }
    case 'user.updated': {
      response = await handleUserUpdated(event.data)

      break
    }
    case 'user.deleted': {
      response = await handleUserDeleted(event.data)

      break
    }
    default: {
      break
    }
  }

  return response
}
