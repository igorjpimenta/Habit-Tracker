import { config } from '../../config'

import axios from 'axios'

interface GoalCompletionRequest {
  goalId: string
}

export async function createGoalCompletion({
  goalId,
}: GoalCompletionRequest): Promise<void> {
  await axios.patch(`${config.API_URL}/goals/${goalId}/completion`)
}
