import { config } from '../../config'

import axios from 'axios'

interface UpdateGoalCompletionRequest {
  goalId: string
  completionId: string
  completedAt: string
}

export async function updateGoalCompletion({
  goalId,
  completionId,
  completedAt,
}: UpdateGoalCompletionRequest): Promise<void> {
  await axios.put(
    `${config.API_URL}/goals/${goalId}/completion/${completionId}`,
    {
      completedAt,
    }
  )
}
