import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'

import dayjs from 'dayjs'
import { and, eq, gte, lte, sql } from 'drizzle-orm'

export async function getWeekSummary() {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )

  const goalsCompletedInWeek = db.$with('goals_completed_in_week').as(
    db
      .select({
        id: goalCompletions.id,
        title: goals.title,
        completedOn: sql /*sql*/`
          date(${goalCompletions.createdAt})
        `.as('completed_on'),
        completedAt: sql /*sql*/`
          ${goalCompletions.createdAt}::time
        `.as('completed_at'),
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
  )

  const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
    db
      .select({
        completedOn: goalsCompletedInWeek.completedOn,
        completions: sql /*sql*/`
          json_agg(
            json_build_object(
              'id', ${goalsCompletedInWeek.id},
              'title', ${goalsCompletedInWeek.title},
              'completedAt', ${goalsCompletedInWeek.completedAt}
            )
          )
        `.as('completions'),
      })
      .from(goalsCompletedInWeek)
      .groupBy(goalsCompletedInWeek.completedOn)
  )

  const result = await db
    .with(goalsCompletedInWeek, goalsCreatedUpToWeek, goalsCompletedByWeekDay)
    .select({
      total: sql /*sql*/`(
        select sum(${goalsCreatedUpToWeek.desiredWeeklyFrequency})
        from ${goalsCreatedUpToWeek}
      )`.mapWith(Number),
      completed: sql /*sql*/`(
        select count(${goalsCompletedInWeek.id})
        from ${goalsCompletedInWeek}
      )`.mapWith(Number),
      goalsCompletionsPerDay: sql /*sql*/`(
        select json_object_agg(
          ${goalsCompletedByWeekDay.completedOn},
          ${goalsCompletedByWeekDay.completions}
        )
        from ${goalsCompletedByWeekDay}
      )`,
    })
    .from(sql`(select 1) as dummy`)

  return {
    summary: result,
  }
}
