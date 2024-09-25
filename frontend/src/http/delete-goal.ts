import { config } from '../../config'

import axios from 'axios'

interface DeleteGoalRequest {
  goalId: string
}

export async function deleteGoal({ goalId }: DeleteGoalRequest): Promise<void> {
  await axios.delete(`${config.API_URL}/goals/${goalId}`)
}
