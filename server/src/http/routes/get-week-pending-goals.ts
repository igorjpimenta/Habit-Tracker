import { getWeekPendingGoals } from '../../functions/get-week-pending-goals'
import { APIError } from '../../utils/error-handler'

import { StatusCodes } from 'http-status-codes'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import dayjs from 'dayjs'
import z from 'zod'

export const getWeekPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/goals/pending',
    {
      schema: {
        querystring: z.object({
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
        }),
      },
    },
    async request => {
      const { timezone } = request.query
      const { pendingGoals } = await getWeekPendingGoals({ timezone })

      return { pendingGoals }
    }
  )
}
