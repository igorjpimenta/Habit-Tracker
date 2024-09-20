import { db } from '../db'
import {
  goalsCompletedByWeekDay,
  goalsCompletedInWeek,
  goalsCreated,
  goalsCreatedInWeek,
} from '../db/queries'
import { goals } from '../db/schema'
import { getWeekDateRange } from '../utils/date-utils'

import { sql } from 'drizzle-orm'

type GoalsCompletionsPerDayProps = Record<
  string,
  {
    id: string
    goalId: string
    title: string
    completedAt: string
  }[]
>
interface GetWeekGoalsSummaryProps {
  timezone?: string
  year?: number
  weekOfYear?: number
}

export async function getWeekGoalsSummary({
  timezone = 'UTC',
  year,
  weekOfYear,
}: GetWeekGoalsSummaryProps) {
  const { firstDayOfWeek, lastDayOfWeek } = getWeekDateRange({
    timezone,
    year,
    weekOfYear,
  })

  const goalsCompletedInWeekQuery = goalsCompletedInWeek(
    firstDayOfWeek,
    lastDayOfWeek
  )

  const goalsCreatedInWeekQuery = goalsCreatedInWeek(
    firstDayOfWeek,
    lastDayOfWeek
  )

  const goalsCompletedByWeekDayQuery = goalsCompletedByWeekDay({
    timezone,
    firstDayOfWeek,
    lastDayOfWeek,
  })

  const [summary] = await db
    .with(
      goalsCompletedInWeekQuery,
      goalsCreatedInWeekQuery,
      goalsCompletedByWeekDayQuery,
      goalsCreated
    )
    .select({
      allTimeTotal: sql /*sql*/`(
          select coalesce(
            sum(${goalsCreated.desiredWeeklyFrequency}), 0
          )
          from ${goalsCreated}
        )`.mapWith(Number),
      total: sql /*sql*/`(
          select coalesce(
            sum(${goalsCreatedInWeekQuery.desiredWeeklyFrequency}), 0
          )
          from ${goalsCreatedInWeekQuery}
        )`.mapWith(Number),
      completed: sql /*sql*/`(
          select count(${goalsCompletedInWeekQuery.id})
          from ${goalsCompletedInWeekQuery}
        )`.mapWith(Number),
      goalsCompletionsPerDay: sql<GoalsCompletionsPerDayProps> /*sql*/`(
          select coalesce(
            json_object_agg(
              ${goalsCompletedByWeekDayQuery.completedOn},
              ${goalsCompletedByWeekDayQuery.completions}
            ), '{}'::json
          )
          from ${goalsCompletedByWeekDayQuery}
        )`,
    })
    .from(sql`(select 1) as dummy`)

  return {
    summary,
  }
}
