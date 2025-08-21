import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

export const createConnection = (connectionString: string) =>
  drizzle({ client: neon(connectionString), schema })
