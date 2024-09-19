import { db } from '../db'
import {
  goalsCompletedByWeekDay,
  goalsCompletedInWeek,
  goalsCreatedUpToWeek,
} from '../db/queries'

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

export async function getWeekGoalsSummary(timezone = 'UTC') {
  const goalsCompletedByWeekDayQuery = goalsCompletedByWeekDay(timezone)

  const [summary] = await db
    .with(
      goalsCompletedInWeek,
      goalsCreatedUpToWeek,
      goalsCompletedByWeekDayQuery
    )
    .select({
      total: sql /*sql*/`(
          select sum(${goalsCreatedUpToWeek.desiredWeeklyFrequency})
          from ${goalsCreatedUpToWeek}
        )`.mapWith(Number),
      completed: sql /*sql*/`(
          select count(${goalsCompletedInWeek.id})
          from ${goalsCompletedInWeek}
        )`.mapWith(Number),
      goalsCompletionsPerDay: sql /*sql*/<GoalsCompletionsPerDayProps>`(
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
