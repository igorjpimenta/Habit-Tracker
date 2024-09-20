import { getWeekGoalsSummary } from '../../functions/get-week-goals-summary'
import { APIError } from '../../utils/error-handler'

import type { RouteHandlerMethod } from 'fastify'
import z from 'zod'
import { StatusCodes } from 'http-status-codes'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(weekOfYear)

const querystringSchema = z.object({
  timezone: z
    .string()
    .optional()
    .refine(val => {
      try {
        dayjs().tz(val).isValid()
        return true
      } catch {
        throw new APIError(
          'Invalid timezone provided.',
          StatusCodes.BAD_REQUEST
        )
      }
    }),
  year: z.coerce.number().optional().default(dayjs().year()),
  weekOfYear: z.coerce.number().optional().default(dayjs().week()),
})

export const handleGetWeekGoalsSummary: RouteHandlerMethod = async request => {
  const { timezone, year, weekOfYear } = querystringSchema.parse(request.query)
  const { summary } = await getWeekGoalsSummary({
    timezone,
    year,
    weekOfYear,
  })

  return { summary }
}
