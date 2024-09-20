import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(weekOfYear)

interface GetWeekDateRangeProps {
  timezone?: string
  year?: number
  weekOfYear?: number
}

export function getWeekDateRange({
  timezone = 'UTC',
  year = dayjs().year(),
  weekOfYear = dayjs().week(),
}: GetWeekDateRangeProps) {
  const firstDayOfWeek = dayjs()
    .tz(timezone)
    .year(year)
    .week(weekOfYear)
    .startOf('week')
    .startOf('day')
    .toDate()

  const lastDayOfWeek = dayjs()
    .tz(timezone)
    .year(year)
    .week(weekOfYear)
    .endOf('week')
    .endOf('day')
    .toDate()

  return { firstDayOfWeek, lastDayOfWeek }
}
