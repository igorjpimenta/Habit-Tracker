import { createGoalCompletion } from '../../functions/create-goal-completion'
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

const paramsSchema = z.object({
  goalId: z.string(),
})

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

export const handleCreateGoalCompletion: RouteHandlerMethod = async request => {
  const { goalId } = paramsSchema.parse(request.params)
  const { timezone } = querystringSchema.parse(request.query)

  const { goalCompletion } = await createGoalCompletion({
    goalId,
    timezone,
  })

  return { id: goalCompletion.id }
}
