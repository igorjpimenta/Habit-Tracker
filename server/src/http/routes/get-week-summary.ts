import { getWeekSummary } from '../../functions/get-week-summary'
import { APIError } from '../../utils/error-handler'

import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { StatusCodes } from 'http-status-codes'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/summary',
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
      const { summary } = await getWeekSummary(timezone)

      return { summary }
    }
  )
}
