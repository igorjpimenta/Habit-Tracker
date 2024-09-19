import { Button } from '../../../components/button'
import { DialogTrigger } from '../../../components/dialog'
import { Icon } from '../../../components/icon'
import { Progress, ProgressIndicator } from '../../../components/progress-bar'
import { Separator } from '../../../components/separator'
import { getWeekSummary } from '../../../http/get-week-summary'
import { PendingGoals } from './components/pending-goals'
import { GoalCompletion } from './components/goal-completion'

import { Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export function Summary() {
  const { data: summary } = useQuery({
    queryKey: ['summary'],
    queryFn: getWeekSummary,
    staleTime: 1000 * 60,
  })

  if (!summary) {
    return null
  }

  function formatDateRange(startDate: Date, endDate: Date): string {
    const startMonth = startDate.toLocaleString('default', { month: 'long' })
    const endMonth = endDate.toLocaleString('default', { month: 'long' })

    const startDay = startDate.getDate()
    const endDay = endDate.getDate()

    if (startDate === endDate) {
      return `${startMonth} ${startDay}`
    }

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} to ${endDay}`
    }

    return `${startMonth} ${startDay} to ${endMonth} ${endDay}`
  }

  function formatWeekDay(date: Dayjs) {
    const today = dayjs()
    const yesterday = today.subtract(1, 'day')

    if (date.isSame(today, 'date')) {
      return 'Today'
    }

    if (date.isSame(yesterday, 'date')) {
      return 'Yesterday'
    }

    return date.format('dddd')
  }

  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const completedPercentage = (
    (summary.completed / summary.total) *
    100
  ).toFixed()

  const sortedSummaryByDate = Object.entries(
    summary.goalsCompletionsPerDay
  ).sort(([dateA], [dateB]) => dayjs(dateB).valueOf() - dayjs(dateA).valueOf())

  return (
    <div className="max-w-[480px] py-10 px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon />

          <span className="text-lg font-semibold">
            {formatDateRange(firstDayOfWeek, lastDayOfWeek)}
          </span>
        </div>

        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Create goal
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress value={summary.completed} max={summary.total}>
          <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
        </Progress>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            You have done{' '}
            <span className="text-zinc-100">{summary.completed}</span> of{' '}
            <span className="text-zinc-100">{summary.total}</span> goals this
            week.
          </span>

          <span>{completedPercentage}%</span>
        </div>
      </div>

      <Separator />

      <PendingGoals />

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Your week</h2>

        {sortedSummaryByDate.map(([date, goalsCompletions]) => {
          const weekDay = formatWeekDay(dayjs(date))
          const formattedDate = dayjs(date).format('MMMM D')

          const sortedGoalsCompletionsByCompletedAt = goalsCompletions.sort(
            (a, b) =>
              dayjs(b.completedAt, 'HH:mm:ss').valueOf() -
              dayjs(a.completedAt, 'HH:mm:ss').valueOf()
          )

          return (
            <div key={date} className="flex flex-col gap-4">
              <h3 className="font-medium">
                {weekDay}{' '}
                <span className="text-zinc-400 text-xs">({formattedDate})</span>
              </h3>

              <ul className="flex flex-col gap-3">
                {sortedGoalsCompletionsByCompletedAt.map(goalCompletion => {
                  const formattedTime = dayjs(
                    goalCompletion.completedAt,
                    'HH:mm:ss'
                  ).format('h:mma')

                  return (
                    <GoalCompletion
                      key={goalCompletion.id}
                      completionId={goalCompletion.id}
                      goalId={goalCompletion.goalId}
                      title={goalCompletion.title}
                      completedAt={formattedTime}
                    />
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
