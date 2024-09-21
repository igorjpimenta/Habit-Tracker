import { config } from '../../config'

import axios from 'axios'

interface CreateGoalCompletionRequest {
  goalId: string
}

export async function createGoalCompletion({
  goalId,
}: CreateGoalCompletionRequest): Promise<void> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  await axios.patch(`${config.API_URL}/goals/${goalId}/completion`, null, {
    params: { timezone },
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
