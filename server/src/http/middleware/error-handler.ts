import { APIError } from '../../utils/error-handler'

import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import z from 'zod'

export function errorHandler(
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply
) {
  let message: string = error.message
  let statusCode: number

  if (!(error instanceof APIError) || !error.statusCode) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    message = ReasonPhrases.INTERNAL_SERVER_ERROR
  } else {
    statusCode = error.statusCode
    message = error.message
  }

  if (error instanceof z.ZodError) {
    statusCode = StatusCodes.BAD_REQUEST
    message = JSON.parse(error.message)
  }

  return reply.status(statusCode).send({
    message,
  })
}
