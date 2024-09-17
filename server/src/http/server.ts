require('dotenv').config({ path: '../.env' })

import { createGoalRoute } from './routes/create-goal'
import { createGoalCompletionRoute } from './routes/create-goal-completion'
import { getWeekPendingGoalsRoute } from './routes/get-week-pending-goals'
import { getWeekSummaryRoute } from './routes/get-week-summary'
import { errorHandler } from './middleware/error-handler'

import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.setErrorHandler(errorHandler)

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(getWeekPendingGoalsRoute)
app.register(getWeekSummaryRoute)
app.register(createGoalRoute)
app.register(createGoalCompletionRoute)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running!')
  })
