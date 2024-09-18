import { config } from '../../config'

import axios from 'axios'

interface WeekPendingGoalsResponse {
  id: string
  title: string
  desiredWeeklyFrequency: number
  completionCount: number
}

export async function getWeekPendingGoals(): Promise<
  WeekPendingGoalsResponse[]
> {
  const { data } = await axios.get<{
    pendingGoals: WeekPendingGoalsResponse[]
  }>(`${config.API_URL}/pending-goals`)

  return data.pendingGoals
}
