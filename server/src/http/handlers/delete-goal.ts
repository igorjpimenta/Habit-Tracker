import { deleteGoal } from '../../functions/delete-goal'

import type { RouteHandlerMethod } from 'fastify'
import z from 'zod'

const paramsSchema = z.object({
  goalId: z.string().uuid(),
})

export const handleDeleteGoal: RouteHandlerMethod = async request => {
  const { goalId: id } = paramsSchema.parse(request.params)

  await deleteGoal({ id })
}
