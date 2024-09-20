import { getWeekPendingGoals } from '../../functions/get-week-pending-goals'
import { APIError } from '../../utils/error-handler'

import type { RouteHandlerMethod } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import dayjs from 'dayjs'
import z from 'zod'

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
