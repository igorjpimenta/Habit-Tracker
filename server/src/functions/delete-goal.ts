import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import { getGoal } from '../db/queries'
import { APIError } from '../utils/error-handler'

import { StatusCodes } from 'http-status-codes'
import { eq } from 'drizzle-orm'

interface DeleteGoalRequest {
  id: string
}

export async function deleteGoal({ id }: DeleteGoalRequest) {
  const goal = await getGoal(id)

  if (!goal) {
    throw new APIError(
      "There aren't any goal with the given id.",
      StatusCodes.NOT_FOUND
    )
  }

  await db.delete(goalCompletions).where(eq(goalCompletions.goalId, id))
  await db.delete(goals).where(eq(goals.id, id))
}
