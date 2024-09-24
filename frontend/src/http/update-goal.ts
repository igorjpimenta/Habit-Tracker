import { config } from '../../config'

import axios from 'axios'

interface UpdateGoalRequest {
  goalId: string
  title: string
  desiredWeeklyFrequency: number
}

export async function updateGoal({
  goalId,
  title,
  desiredWeeklyFrequency,
}: UpdateGoalRequest): Promise<void> {
  await axios.put(`${config.API_URL}/goals/${goalId}`, {
    title,
    desiredWeeklyFrequency,
  })
}
