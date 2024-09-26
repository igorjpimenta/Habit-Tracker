import { deleteGoalCompletion } from '../../functions/delete-goal-completion'

import type { RouteHandlerMethod } from 'fastify'
import z from 'zod'

const paramsSchema = z.object({
  goalId: z.string().uuid(),
  completionId: z.string().uuid(),
})

export const handleDeleteGoalCompletion: RouteHandlerMethod = async request => {
  const { goalId, completionId } = paramsSchema.parse(request.params)

  await deleteGoalCompletion({
    goalId,
    completionId,
  })
}
