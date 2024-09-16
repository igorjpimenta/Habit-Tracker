import { db } from '../db'
import { goalCompletions } from '../db/schema'
import { getGoalDetails } from '../db/queries'

interface CreateGoalCompletionRequest {
  goalId: string
}

export async function createGoalCompletion({
  goalId,
}: CreateGoalCompletionRequest) {
  const { completionsCount, desiredWeeklyFrequency } =
    await getGoalDetails(goalId)

  if (completionsCount >= desiredWeeklyFrequency) {
    throw new Error('Goal already completed this week!')
  }

  const result = await db.insert(goalCompletions).values({ goalId }).returning()
  const [goalCompletion] = result

  return {
    goalCompletion,
  }
}
