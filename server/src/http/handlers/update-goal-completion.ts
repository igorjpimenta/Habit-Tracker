import { updateGoalCompletion } from '../../functions/update-goal-completion'

import type { RouteHandlerMethod } from 'fastify'
import z from 'zod'

const paramsSchema = z.object({
  goalId: z.string().uuid(),
  completionId: z.string().uuid(),
})

const bodySchema = z.object({
  completedAt: z.coerce.date(),
})

export const handleUpdateGoalCompletion: RouteHandlerMethod = async request => {
  const { goalId, completionId } = paramsSchema.parse(request.params)
  const { completedAt } = bodySchema.parse(request.body)

  await updateGoalCompletion({ goalId, completionId, completedAt })
}
