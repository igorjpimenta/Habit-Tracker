import { deleteGoalCompletion } from '../../functions/delete-goal-completion'

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const deleteGoalCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/goals/:goalId/completion/:completionId',
    {
      schema: {
        params: z.object({
          goalId: z.string(),
          completionId: z.string(),
        }),
      },
    },
    async request => {
      const { goalId, completionId } = request.params

      await deleteGoalCompletion({
        goalId,
        completionId,
      })
    }
  )
}
