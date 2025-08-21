import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: varchar('id').primaryKey(),
  email: varchar('email').notNull().unique(),
  phoneNumber: varchar('phone_number').notNull(),
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
