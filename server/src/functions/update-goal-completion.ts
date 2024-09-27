import { db } from '../db'
import { getGoal, getGoalCompletion } from '../db/queries'
import { goalCompletions } from '../db/schema'
import { APIError } from '../utils/error-handler'

import { eq } from 'drizzle-orm'
import { StatusCodes } from 'http-status-codes'

interface UpdateGoalCompletionRequest {
  goalId: string
  completionId: string
  completedAt: Date
}

export async function updateGoalCompletion({
  goalId,
  completionId,
  completedAt,
}: UpdateGoalCompletionRequest) {
  const goal = await getGoal(goalId)

  if (!goal) {
    throw new APIError(
      "There aren't any goal with the given id.",
      StatusCodes.NOT_FOUND
    )
  }

  const goalCompletion = await getGoalCompletion(goalId, completionId)

  if (!goalCompletion) {
    throw new APIError(
      "This completion event does not belong to the specified goal or doesn't exist",
      StatusCodes.BAD_REQUEST
    )
  }

  await db
    .update(goalCompletions)
    .set({
      ...(completedAt ? { completedAt } : {}),
    })
    .where(eq(goalCompletions.id, completionId))
}
