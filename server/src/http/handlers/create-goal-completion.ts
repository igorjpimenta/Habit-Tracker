import { createGoalCompletion } from '../../functions/create-goal-completion'

import type { RouteHandlerMethod } from 'fastify'
import z from 'zod'

const paramsSchema = z.object({
  goalId: z.string(),
})

export const handleCreateGoalCompletion: RouteHandlerMethod = async request => {
  const { goalId } = paramsSchema.parse(request.params)

  const { goalCompletion } = await createGoalCompletion({
    goalId,
  })

  return { id: goalCompletion.id }
}
