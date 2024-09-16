import { createGoalCompletion } from '../../functions/create-goal-completion'

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const createGoalCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/completions',
    {
      schema: {
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async request => {
      const { goalId } = request.body

      await createGoalCompletion({
        goalId,
      })
    }
  )
}
