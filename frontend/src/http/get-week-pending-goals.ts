import { config } from '../../config'

import axios from 'axios'

export interface PendingGoalsType {
  id: string
  title: string
  desiredWeeklyFrequency: number
  completionCount: number
}

export type GetWeekPendingGoalsResponse = PendingGoalsType[]

export async function getWeekPendingGoals(): Promise<GetWeekPendingGoalsResponse> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const { data } = await axios.get<{
    pendingGoals: PendingGoalsType[]
  }>(`${config.API_URL}/goals/pending`, { params: { timezone } })

  return data.pendingGoals
}
