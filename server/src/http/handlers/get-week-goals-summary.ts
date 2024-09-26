import { getWeekGoalsSummary } from '../../functions/get-week-goals-summary'
import { summaryValidator } from '../../utils/schema-validator'

import type { RouteHandlerMethod } from 'fastify'
import z from 'zod'

const querystringSchema = z
  .object({
    timezone: z.string().optional(),
    year: z.coerce.number().int().optional(),
    weekOfYear: z.coerce.number().int().optional(),
  })
  .superRefine(data => summaryValidator({ ...data }))

export const handleGetWeekGoalsSummary: RouteHandlerMethod = async request => {
  const { timezone, year, weekOfYear } = querystringSchema.parse(request.query)
  const { summary } = await getWeekGoalsSummary({
    timezone,
    year,
    weekOfYear,
  })

  return { summary }
}
