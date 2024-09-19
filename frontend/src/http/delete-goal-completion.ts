import { config } from '../../config'

import axios from 'axios'

interface DeleteGoalCompletionRequest {
  goalId: string
  completionId: string
}

export async function deleteGoalCompletion({
  goalId,
  completionId,
}: DeleteGoalCompletionRequest): Promise<void> {
  await axios.delete(
    `${config.API_URL}/goals/${goalId}/completion/${completionId}`
  )
}
