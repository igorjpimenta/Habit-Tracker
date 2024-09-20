import { db } from '../db'
import { goalCompletions } from '../db/schema'
import { getGoal, getGoalCompletion } from '../db/queries'
import { APIError } from '../utils/error-handler'

import { StatusCodes } from 'http-status-codes'
import { eq } from 'drizzle-orm'

interface DeleteGoalCompletionRequest {
  goalId: string
  completionId: string
}

export async function deleteGoalCompletion({
  goalId,
  completionId,
}: DeleteGoalCompletionRequest) {
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

  await db.delete(goalCompletions).where(eq(goalCompletions.id, completionId))
}
