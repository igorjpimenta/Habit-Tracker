import { getWeekPendingGoals } from '../../functions/get-week-pending-goals'
import { APIError } from '../../utils/error-handler'

import type { RouteHandlerMethod } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'
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
})

export const handleGetWeekPendingGoals: RouteHandlerMethod = async request => {
  const { timezone } = querystringSchema.parse(request.query)
  const { pendingGoals } = await getWeekPendingGoals({ timezone })

  return { pendingGoals }
}
