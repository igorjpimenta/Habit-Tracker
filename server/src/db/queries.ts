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

export const goalsCompletedByWeekDay = db
  .$with('goals_completed_by_week_day')
  .as(
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
