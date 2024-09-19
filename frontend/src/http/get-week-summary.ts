import { config } from '../../config'

import axios from 'axios'

interface WeekSummaryResponse {
  total: number
  completed: number
  goalsCompletionsPerDay: Record<
    string,
    {
      id: string
      goalId: string
      title: string
      completedAt: string
    }[]
  >
}

export async function getWeekSummary(): Promise<WeekSummaryResponse> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const { data } = await axios.get<{ summary: WeekSummaryResponse }>(
    `${config.API_URL}/summary`,
    { params: { timezone } }
  )

  return data.summary
}
