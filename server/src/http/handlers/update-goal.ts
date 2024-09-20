import { updateGoal } from '../../functions/update-goal'

import type { RouteHandlerMethod } from 'fastify'
import z from 'zod'

const paramsSchema = z.object({
  goalId: z.string().uuid(),
})

const bodySchema = z.object({
  title: z.string().optional(),
  desiredWeeklyFrequency: z.number().optional(),
})

export const handleUpdateGoal: RouteHandlerMethod = async request => {
  const { goalId: id } = paramsSchema.parse(request.params)
  const { title, desiredWeeklyFrequency } = bodySchema.parse(request.body)

  await updateGoal({ id, title, desiredWeeklyFrequency })
}
