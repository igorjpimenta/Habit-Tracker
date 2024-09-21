import { db } from '../db'
import { goalCompletions } from '../db/schema'
import { getGoal, getGoalDetails } from '../db/queries'
import { APIError } from '../utils/error-handler'

import { StatusCodes } from 'http-status-codes'

interface CreateGoalCompletionRequest {
  goalId: string
  timezone?: string
}

export async function createGoalCompletion({
  goalId,
  timezone = 'UTC',
}: CreateGoalCompletionRequest) {
  const goal = await getGoal(goalId)

  if (!goal) {
    throw new APIError(
      "There aren't any goal with the given id.",
      StatusCodes.NOT_FOUND
    )
  }

  const { completionsCount, desiredWeeklyFrequency } = await getGoalDetails({
    goalId,
    timezone,
  })

  if (completionsCount >= desiredWeeklyFrequency) {
    throw new APIError(
      'Goal already completed this week!',
      StatusCodes.BAD_REQUEST
    )
  }

  const result = await db.insert(goalCompletions).values({ goalId }).returning()
  const [goalCompletion] = result

  return {
    goalCompletion,
  }
}
