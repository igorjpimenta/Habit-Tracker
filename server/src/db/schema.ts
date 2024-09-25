import {
  pgTable,
  varchar,
  uuid,
  text,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core'
import { v4 as uuid4 } from 'uuid'

export const goals = pgTable('goals', {
  id: uuid('id').primaryKey().$defaultFn(uuid4), // filling function and all needed changes writted manually in 0002_tense_wolf_cub.sql
  title: text('title').notNull(),
  desiredWeeklyFrequency: integer('desired_weekly_frequency').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }), // filling trigger and all needed changes writted manually in 0003_tiresome_lockjaw.sql
})

export const goalCompletions = pgTable('goal_completions', {
  id: uuid('id').primaryKey().$defaultFn(uuid4), // filling function and all needed changes writted manually in 0002_tense_wolf_cub.sql
  goalId: uuid('goal_id')
    .references(() => goals.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }), // filling trigger and all needed changes writted manually in 0003_tiresome_lockjaw.sql
})

export const goalsChangesHistory = pgTable('goals_changes_history', {
  id: uuid('id').primaryKey().$defaultFn(uuid4), // filling function and the feeding mechanism writted manually in 0004_mysterious_gunslinger.sql
  goalId: uuid('goal_id')
    .references(() => goals.id, { onDelete: 'cascade' })
    .notNull(),
  fieldName: varchar('field_name', { length: 25 }).notNull(),
  oldValue: text('old_value').notNull(),
  newValue: text('new_value').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
