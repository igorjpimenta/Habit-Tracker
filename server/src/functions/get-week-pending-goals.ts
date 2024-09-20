import { db } from '../db'
import { goalCompletionsCount, goalsCreatedInWeek } from '../db/queries'
import { getWeekDateRange } from '../utils/date-utils'

import { eq, sql } from 'drizzle-orm'

interface GetWeekPendingGoalsProps {
  timezone?: string
  year?: number
  weekOfYear?: number
}

export async function getWeekPendingGoals({
  timezone = 'UTC',
  year,
  weekOfYear,
}: GetWeekPendingGoalsProps) {
  const { firstDayOfWeek, lastDayOfWeek } = getWeekDateRange({
    timezone,
    year,
    weekOfYear,
  })

  const goalsCreatedInWeekQuery = goalsCreatedInWeek(
    firstDayOfWeek,
    lastDayOfWeek
  )
  const goalCompletionsCountQuery = goalCompletionsCount(
    firstDayOfWeek,
    lastDayOfWeek
  )

  const pendingGoals = await db
    .with(goalsCreatedInWeekQuery, goalCompletionsCountQuery)
    .select({
      id: goalsCreatedInWeekQuery.id,
      title: goalsCreatedInWeekQuery.title,
      desiredWeeklyFrequency: goalsCreatedInWeekQuery.desiredWeeklyFrequency,
      completionCount: sql /*sql*/`
          coalesce(${goalCompletionsCountQuery.completionsCount}, 0)
        `
        .mapWith(Number)
        .as('completions_count'),
    })
    .from(goalsCreatedInWeekQuery)
    .leftJoin(
      goalCompletionsCountQuery,
      eq(goalCompletionsCountQuery.goalId, goalsCreatedInWeekQuery.id)
    )

  return {
    pendingGoals,
  }
}
