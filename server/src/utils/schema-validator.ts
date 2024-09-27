import { APIError } from './error-handler'

import { StatusCodes } from 'http-status-codes'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear'
import isLeapYear from 'dayjs/plugin/isLeapYear'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(weekOfYear)
dayjs.extend(isoWeeksInYear)
dayjs.extend(isLeapYear)

interface SummaryValidatorProps {
  timezone?: string
  year?: number
  weekOfYear?: number
}

export function summaryValidator({
  timezone,
  year,
  weekOfYear,
}: SummaryValidatorProps) {
  timezoneValidator(timezone)

  if (year && weekOfYear === undefined) {
    throw new APIError(
      "'weekOfYear' is required when 'year' is provided.",
      StatusCodes.BAD_REQUEST
    )
  }

  if (year !== undefined) {
    const currentYear = dayjs()
      .tz(timezone || 'UTC')
      .year()

    if (year < 1900 || year > currentYear) {
      throw new APIError(
        `'${year}' is not a valid year. It should be an integer between 1900 and ${currentYear}.`,
        StatusCodes.BAD_REQUEST
      )
    }
  }

  if (year === undefined) {
    year = dayjs().year()
  }

  if (weekOfYear !== undefined) {
    const weekCount = dayjs().year(year).isoWeeksInYear()

    if (weekOfYear < 1 || weekOfYear > weekCount) {
      throw new APIError(
        `'${weekOfYear}' is not a valid week of the year ${year}. It should be between 1 and ${weekCount}.`,
        StatusCodes.BAD_REQUEST
      )
    }
  }

  if (weekOfYear === undefined) {
    weekOfYear = dayjs().week()
  }
}

export function timezoneValidator(timezone: string | undefined) {
  if (timezone) {
    const isTimezone = Intl.supportedValuesOf('timeZone').includes(timezone)

    if (!isTimezone) {
      throw new APIError(
        `'${timezone}' is not a valid timezone.`,
        StatusCodes.BAD_REQUEST
      )
    }
  }
}

interface UpdateGoalValidatorProps {
  title?: string
  desiredWeeklyFrequency?: number
}

export function updateGoalValidator({
  title,
  desiredWeeklyFrequency,
}: UpdateGoalValidatorProps) {
  if (!title && !desiredWeeklyFrequency) {
    throw new APIError(
      "At least one of 'title' or 'desiredWeeklyFrequency' must be provided.",
      StatusCodes.BAD_REQUEST
    )
  }
}
