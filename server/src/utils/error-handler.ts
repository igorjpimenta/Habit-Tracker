import type { FastifyError } from 'fastify'
import { getReasonPhrase } from 'http-status-codes'

export class APIError extends Error implements FastifyError {
  statusCode: number
  code: string

  constructor(message: string, statusCode: number, code?: string) {
    super(message)
    this.code = code ?? getReasonPhrase(statusCode)
    this.statusCode = statusCode
  }
}
