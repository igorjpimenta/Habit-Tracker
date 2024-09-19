import { config } from '../../config'

import axios from 'axios'

interface GetWeekGoalsSummaryResponse {
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

export async function getWeekGoalsSummary(): Promise<GetWeekGoalsSummaryResponse> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const { data } = await axios.get<{ summary: GetWeekGoalsSummaryResponse }>(
    `${config.API_URL}/goals/summary`,
    { params: { timezone } }
  )

  return data.summary
}
