import { db } from '.'
import { getWeekDateRange } from '../utils/date-utils'
import { goalCompletions, goals, goalsChangesHistory } from './schema'

import { and, count, eq, gte, lte, sql } from 'drizzle-orm'

export const goalsCreatedUpToWeek = (lastDayOfWeek: Date) =>
  db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: sql /* sql */`
          coalesce(
            (
              select ${goalsChangesHistory.oldValue}::int
              from ${goalsChangesHistory}
              where ${goalsChangesHistory.goalId} = ${goals.id.getSQL()}
                and ${goalsChangesHistory.fieldName} = ${'desired_weekly_frequency'}
                and ${goalsChangesHistory.createdAt} > ${lastDayOfWeek.toISOString()}
              order by ${goalsChangesHistory.createdAt}
              limit 1
            ), ${goals.desiredWeeklyFrequency}
          )
        `
          .mapWith(Number)
          .as('desired_weekly_frequency'),
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )

export const goalCompletionsCount = (
  firstDayOfWeek: Date,
  lastDayOfWeek: Date
) =>
  db.$with('goal_completions_count').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionsCount: count(goalCompletions.id).as('completions_count'),
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.completedAt, firstDayOfWeek),
          lte(goalCompletions.completedAt, lastDayOfWeek)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

export const goalsCompletedInWeek = (
  firstDayOfWeek: Date,
  lastDayOfWeek: Date
) =>
  db.$with('goals_completed_in_week').as(
    db
      .select({
        id: goalCompletions.id,
        goalId: goalCompletions.goalId,
        title: goals.title,
        completedAt: sql /*sql*/`
          ${goalCompletions.completedAt}
        `.as('completed_at'),
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
      .where(
        and(
          gte(goalCompletions.completedAt, firstDayOfWeek),
          lte(goalCompletions.completedAt, lastDayOfWeek)
        )
      )
  )

interface goalsCompletedByWeekDay {
  timezone: string
  firstDayOfWeek: Date
  lastDayOfWeek: Date
}

export function goalsCompletedByWeekDay({
  timezone,
  firstDayOfWeek,
  lastDayOfWeek,
}: goalsCompletedByWeekDay) {
  const timezoneParam = sql`${sql.raw(`'${timezone}'`)}`
  const goalsCompletedInWeekQuery = goalsCompletedInWeek(
    firstDayOfWeek,
    lastDayOfWeek
  )

  return db.$with('goals_completed_by_week_day').as(
    db
      .select({
        completedOn:
          sql /*sql*/`date(${goalsCompletedInWeekQuery.completedAt} AT TIME ZONE ${timezoneParam})`.as(
            'completed_on'
          ),
        completions: sql /*sql*/`
            json_agg(
              json_build_object(
                'id', ${goalsCompletedInWeekQuery.id},
                'goalId', ${goalsCompletedInWeekQuery.goalId},
                'title', ${goalsCompletedInWeekQuery.title},
                'completedAt', (${goalsCompletedInWeekQuery.completedAt} AT TIME ZONE ${timezoneParam})::time
              )
            )
          `.as('completions'),
      })
      .from(goalsCompletedInWeekQuery)
      .groupBy(
        sql /*sql*/`date(${goalsCompletedInWeekQuery.completedAt} AT TIME ZONE ${timezoneParam})`
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
      updatedAt: goals.updatedAt,
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
      completedAt: goalCompletions.completedAt,
      createdAt: goalCompletions.createdAt,
      updatedAt: goalCompletions.updatedAt,
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

interface GetGoalDetailsProps {
  goalId: string
  timezone?: string
  year?: number
  weekOfYear?: number
}

export async function getGoalDetails({
  goalId,
  timezone,
  year,
  weekOfYear,
}: GetGoalDetailsProps) {
  const { firstDayOfWeek, lastDayOfWeek } = getWeekDateRange({
    timezone,
    year,
    weekOfYear,
  })

  const goalCompletionsCountQuery = goalCompletionsCount(
    firstDayOfWeek,
    lastDayOfWeek
  )

  const goalsCreatedUpToWeekQuery = goalsCreatedUpToWeek(lastDayOfWeek)

  const [goalDetails] = await db
    .with(goalCompletionsCountQuery, goalsCreatedUpToWeekQuery)
    .select({
      desiredWeeklyFrequency: goalsCreatedUpToWeekQuery.desiredWeeklyFrequency,
      completionsCount: sql /*sql*/`
          coalesce(${goalCompletionsCountQuery.completionsCount}, 0)
        `
        .mapWith(Number)
        .as('completion_count'),
    })
    .from(goalsCreatedUpToWeekQuery)
    .leftJoin(
      goalCompletionsCountQuery,
      eq(goalCompletionsCountQuery.goalId, goalsCreatedUpToWeekQuery.id)
    )
    .where(eq(goalsCreatedUpToWeekQuery.id, goalId))
    .limit(1)

  return goalDetails
}
