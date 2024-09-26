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
  id: uuid('id').primaryKey().$defaultFn(uuid4),
  title: text('title').notNull(),
  desiredWeeklyFrequency: integer('desired_weekly_frequency').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
})

export const goalCompletions = pgTable('goal_completions', {
  id: uuid('id').primaryKey().$defaultFn(uuid4),
  goalId: uuid('goal_id')
    .references(() => goals.id, { onDelete: 'cascade' })
    .notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
})

export const goalsChangesHistory = pgTable('goals_changes_history', {
  id: uuid('id').primaryKey().$defaultFn(uuid4),
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

export const goalCompletionsChangesHistory = pgTable(
  'goal_completions_changes_history',
  {
    id: uuid('id').primaryKey().$defaultFn(uuid4),
    completionId: uuid('completion_id')
      .references(() => goalCompletions.id, { onDelete: 'cascade' })
      .notNull(),
    fieldName: varchar('field_name', { length: 25 }).notNull(),
    oldValue: text('old_value').notNull(),
    newValue: text('new_value').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  }
)
