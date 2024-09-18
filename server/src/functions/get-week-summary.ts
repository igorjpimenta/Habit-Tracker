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
    title: string
    completedAt: string
  }[]
>

export async function getWeekSummary() {
  const [summary] = await db
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
      goalsCompletionsPerDay: sql /*sql*/<GoalsCompletionsPerDayProps>`(
          select json_object_agg(
            ${goalsCompletedByWeekDay.completedOn},
            ${goalsCompletedByWeekDay.completions}
          )
          from ${goalsCompletedByWeekDay}
        )`,
    })
    .from(sql`(select 1) as dummy`)

  return {
    summary,
  }
}
