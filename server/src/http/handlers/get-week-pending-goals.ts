import { getWeekPendingGoals } from '../../functions/get-week-pending-goals'
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

export const handleGetWeekPendingGoals: RouteHandlerMethod = async request => {
  const { timezone, year, weekOfYear } = querystringSchema.parse(request.query)
  const { pendingGoals } = await getWeekPendingGoals({
    timezone,
    year,
    weekOfYear,
  })

  return { pendingGoals }
}
