import { config } from '../../config'

import axios from 'axios'

interface CreateGoalCompletionRequest {
  goalId: string
}

export async function createGoalCompletion({
  goalId,
}: CreateGoalCompletionRequest): Promise<void> {
  await axios.patch(`${config.API_URL}/goals/${goalId}/completion`)
}
