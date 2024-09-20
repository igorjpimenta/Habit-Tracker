import { createGoal } from '../../functions/create-goal'

import type { RouteHandlerMethod } from 'fastify'
import z from 'zod'

const bodySchema = z.object({
  title: z.string(),
  desiredWeeklyFrequency: z.number().int().min(1).max(7),
})

export const handleCreateGoal: RouteHandlerMethod = async (request, reply) => {
  const { title, desiredWeeklyFrequency } = bodySchema.parse(request.body)

  const { goal } = await createGoal({
    title,
    desiredWeeklyFrequency,
  })

  return reply.status(201).send({ id: goal.id })
}
