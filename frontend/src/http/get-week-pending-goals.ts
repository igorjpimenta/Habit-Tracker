import { config } from '../../config'

import axios from 'axios'

interface GetWeekPendingGoalsResponse {
  id: string
  title: string
  desiredWeeklyFrequency: number
  completionCount: number
}

export async function getWeekPendingGoals(): Promise<
  GetWeekPendingGoalsResponse[]
> {
  const { data } = await axios.get<{
    pendingGoals: GetWeekPendingGoalsResponse[]
  }>(`${config.API_URL}/goals/pending`)

  return data.pendingGoals
}
