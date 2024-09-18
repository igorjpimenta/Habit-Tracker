import { config } from '../../config'

import axios from 'axios'

export interface WeekSummaryResponse {
  total: number
  completed: number
  goalsCompletionsPerDay: Record<
    string,
    {
      id: string
      title: string
      completedAt: string
    }[]
  >
}

export async function getWeekSummary(): Promise<WeekSummaryResponse> {
  const { data } = await axios.get<{ summary: WeekSummaryResponse }>(
    `${config.API_URL}/summary`
  )

  return data.summary
}
