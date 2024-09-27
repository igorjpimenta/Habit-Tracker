import { handleCreateGoal } from '../handlers/create-goal'
import { handleUpdateGoal } from '../handlers/update-goal'
import { handleDeleteGoal } from '../handlers/delete-goal'
import { handleCreateGoalCompletion } from '../handlers/create-goal-completion'
import { handleUpdateGoalCompletion } from '../handlers/update-goal-completion'
import { handleDeleteGoalCompletion } from '../handlers/delete-goal-completion'
import { handleGetWeekGoalsSummary } from '../handlers/get-week-goals-summary'
import { handleGetWeekPendingGoals } from '../handlers/get-week-pending-goals'

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const goalsRoutes: FastifyPluginAsyncZod = async app => {
  app.post('/', handleCreateGoal)

  app.get('/summary', handleGetWeekGoalsSummary)

  app.get('/pending', handleGetWeekPendingGoals)

  app.register(
    async app => {
      app.put('/', handleUpdateGoal)

      app.delete('/', handleDeleteGoal)

      app.register(
        async app => {
          app.patch('/', handleCreateGoalCompletion)

          app.register(
            async app => {
              app.put('/', handleUpdateGoalCompletion)

              app.delete('/', handleDeleteGoalCompletion)
            },
            { prefix: '/:completionId' }
          )
        },
        { prefix: '/completion' }
      )
    },
    { prefix: '/:goalId' }
  )
}
