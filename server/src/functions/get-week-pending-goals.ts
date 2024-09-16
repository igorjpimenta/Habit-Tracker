import { db } from '../db'
import { goalCompletionsCount, goalsCreatedUpToWeek } from '../db/queries'

import { eq, sql } from 'drizzle-orm'

export async function getWeekPendingGoals() {
  const pendingGoals = await db
    .with(goalsCreatedUpToWeek, goalCompletionsCount)
    .select({
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
      completionCount: sql /*sql*/`
          coalesce(${goalCompletionsCount.completionsCount}, 0)
        `
        .mapWith(Number)
        .as('completions_count'),
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(
      goalCompletionsCount,
      eq(goalCompletionsCount.goalId, goalsCreatedUpToWeek.id)
    )

  return {
    pendingGoals,
  }
}
