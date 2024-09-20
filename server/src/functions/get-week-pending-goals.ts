import { db } from '../db'
import { goalCompletionsCount, goalsCreatedUpToWeek } from '../db/queries'
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

  const goalsCreatedUpToWeekQuery = goalsCreatedUpToWeek(lastDayOfWeek)
  const goalCompletionsCountQuery = goalCompletionsCount(
    firstDayOfWeek,
    lastDayOfWeek
  )

  const pendingGoals = await db
    .with(goalsCreatedUpToWeekQuery, goalCompletionsCountQuery)
    .select({
      id: goalsCreatedUpToWeekQuery.id,
      title: goalsCreatedUpToWeekQuery.title,
      desiredWeeklyFrequency: goalsCreatedUpToWeekQuery.desiredWeeklyFrequency,
      completionCount: sql /*sql*/`
          coalesce(${goalCompletionsCountQuery.completionsCount}, 0)
        `
        .mapWith(Number)
        .as('completions_count'),
    })
    .from(goalsCreatedUpToWeekQuery)
    .leftJoin(
      goalCompletionsCountQuery,
      eq(goalCompletionsCountQuery.goalId, goalsCreatedUpToWeekQuery.id)
    )

  return {
    pendingGoals,
  }
}
