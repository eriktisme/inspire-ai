import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { users } from './users'

export const frequencyType = pgEnum('frequency_type', ['daily', 'paused'])

export type FrequencyType = (typeof frequencyType.enumValues)[number]

export const preferences = pgTable('preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  frequency: frequencyType('frequency').default('daily'),
  createdAt: timestamp({
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
})

export type Preference = typeof preferences.$inferSelect
