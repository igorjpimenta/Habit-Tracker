import { db } from '../db'
import { getGoal } from '../db/queries'
import { goals } from '../db/schema'
import { APIError } from '../utils/error-handler'

import { eq } from 'drizzle-orm'
import { StatusCodes } from 'http-status-codes'

interface UpdateGoalRequest {
  id: string
  title?: string
  desiredWeeklyFrequency?: number
}

export async function updateGoal({
  id,
  title,
  desiredWeeklyFrequency,
}: UpdateGoalRequest) {
  const goal = await getGoal(id)

  if (!goal) {
    throw new APIError(
      "There aren't any goal with the given id.",
      StatusCodes.NOT_FOUND
    )
  }

  if (!title && !desiredWeeklyFrequency) {
    throw new APIError(
      "At least one of 'title' or 'desiredWeeklyFrequency' must be provided.",
      StatusCodes.BAD_REQUEST
    )
  }

  await db
    .update(goals)
    .set({
      ...(title ? { title } : {}),
      ...(desiredWeeklyFrequency ? { desiredWeeklyFrequency } : {}),
    })
    .where(eq(goals.id, id))
}
