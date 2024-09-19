import { config } from '../../config'

import axios from 'axios'

interface CreateGoalRequest {
  title: string
  desiredWeeklyFrequency: number
}

export async function createGoal({
  title,
  desiredWeeklyFrequency,
}: CreateGoalRequest): Promise<void> {
  await axios.post(`${config.API_URL}/goals`, {
    title,
    desiredWeeklyFrequency,
  })
}
