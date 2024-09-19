import { getWeekPendingGoals } from '../../functions/get-week-pending-goals'

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const getWeekPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/goals/pending', async () => {
    const { pendingGoals } = await getWeekPendingGoals()

    return { pendingGoals }
  })
}
