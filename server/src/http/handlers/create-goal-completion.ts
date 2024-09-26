import { createGoalCompletion } from '../../functions/create-goal-completion'
import { timezoneValidator } from '../../utils/schema-validator'

import type { RouteHandlerMethod } from 'fastify'
import z from 'zod'

const paramsSchema = z.object({
  goalId: z.string().uuid(),
})

const querystringSchema = z.object({
  timezone: z.string().optional().superRefine(timezoneValidator),
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
