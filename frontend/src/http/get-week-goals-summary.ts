import { config } from '../../config'

import axios from 'axios'

interface GetWeekGoalsSummaryRequest {
  year: number
  weekOfYear: number
}

interface GetWeekGoalsSummaryResponse {
  allTimeTotal: number
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

export async function getWeekGoalsSummary({
  year,
  weekOfYear,
}: GetWeekGoalsSummaryRequest): Promise<GetWeekGoalsSummaryResponse> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const { data } = await axios.get<{ summary: GetWeekGoalsSummaryResponse }>(
    `${config.API_URL}/goals/summary`,
    { params: { timezone, year, weekOfYear } }
  )

  return data.summary
}
