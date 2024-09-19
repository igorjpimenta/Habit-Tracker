import { db } from '.'
import { goalCompletions, goals } from './schema'
import { firstDayOfWeek, lastDayOfWeek } from '../utils/date-utils'

import { and, count, eq, gte, lte, sql } from 'drizzle-orm'

export const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
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

export const goalCompletionsCount = db.$with('goal_completions_count').as(
  db
    .select({
      goalId: goalCompletions.goalId,
      completionsCount: count(goalCompletions.id).as('completions_count'),
    })
    .from(goalCompletions)
    .where(
      and(
        gte(goalCompletions.createdAt, firstDayOfWeek),
        lte(goalCompletions.createdAt, lastDayOfWeek)
      )
    )
    .groupBy(goalCompletions.goalId)
)

export const goalsCompletedInWeek = db.$with('goals_completed_in_week').as(
  db
    .select({
      id: goalCompletions.id,
      goalId: goalCompletions.goalId,
      title: goals.title,
      completedOn: sql /*sql*/`
          date(${goalCompletions.createdAt})
        `.as('completed_on'),
      completedAt: sql /*sql*/`
          ${goalCompletions.createdAt}
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

export const goalsCompletedByWeekDay = (timezone: string) => {
  const timezoneParam = sql`${sql.raw(`'${timezone}'`)}`

  return db.$with('goals_completed_by_week_day').as(
    db
      .select({
        completedOn:
          sql /*sql*/`date(${goalsCompletedInWeek.completedAt} AT TIME ZONE ${timezoneParam})`.as(
            'completed_on'
          ),
        completions: sql /*sql*/`
            json_agg(
              json_build_object(
                'id', ${goalsCompletedInWeek.id},
                'goalId', ${goalsCompletedInWeek.goalId},
                'title', ${goalsCompletedInWeek.title},
                'completedAt', (${goalsCompletedInWeek.completedAt} AT TIME ZONE ${timezoneParam})::time
              )
            )
          `.as('completions'),
      })
      .from(goalsCompletedInWeek)
      .groupBy(
        sql /*sql*/`date(${goalsCompletedInWeek.completedAt} AT TIME ZONE ${timezoneParam})`
      )
  )
}

export async function getGoal(goalId: string) {
  const [goal] = await db
    .select({
      id: goals.id,
      title: goals.title,
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      createdAt: goals.createdAt,
    })
    .from(goals)
    .where(eq(goals.id, goalId))
    .limit(1)

  return goal
}

export async function getGoalCompletion(goalId: string, completionId: string) {
  const [goalCompletion] = await db
    .select({
      id: goalCompletions.id,
      goalId: goalCompletions.goalId,
      createdAt: goalCompletions.createdAt,
    })
    .from(goalCompletions)
    .where(
      and(
        eq(goalCompletions.goalId, goalId),
        eq(goalCompletions.id, completionId)
      )
    )
    .limit(1)

  return goalCompletion
}

export async function getGoalDetails(goalId: string) {
  const [goalDetails] = await db
    .with(goalCompletionsCount)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionsCount: sql /*sql*/`
          coalesce(${goalCompletionsCount.completionsCount}, 0)
        `
        .mapWith(Number)
        .as('completion_count'),
    })
    .from(goals)
    .leftJoin(goalCompletionsCount, eq(goalCompletionsCount.goalId, goals.id))
    .where(eq(goals.id, goalId))
    .limit(1)

  return goalDetails
}
