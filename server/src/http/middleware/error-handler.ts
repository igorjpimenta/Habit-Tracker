import { APIError } from '../../utils/error-handler'

import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export function errorHandler(
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply
) {
  if (!(error instanceof APIError) || !error.statusCode) {
    error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    error.message = ReasonPhrases.INTERNAL_SERVER_ERROR
  }

  const statusCode = error.statusCode
  const message = error.message

  return reply.status(statusCode).send({
    message,
  })
}
