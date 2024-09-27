import { Button } from '../../../components/button'
import { Icon } from '../../../components/icon'
import { Progress, ProgressIndicator } from '../../../components/progress-bar'
import { Separator } from '../../../components/separator'
import { getWeekGoalsSummary } from '../../../http/get-week-goals-summary'
import { PendingGoals } from './components/pending-goals'
import { GoalCompletion } from './components/goal-completion'

import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)

interface GoalsSummaryProps {
  year: number
  weekOfYear: number
  onCreateGoalTrigger: () => void
  onManageGoalsTrigger: () => void
  onWeekDecreasing: () => void
  onWeekIncreasing: () => void
}

export function GoalsSummary({
  year,
  weekOfYear,
  onCreateGoalTrigger,
  onManageGoalsTrigger,
  onWeekDecreasing,
  onWeekIncreasing,
}: GoalsSummaryProps) {
  const { data: summary } = useQuery({
    queryKey: ['summary', year, weekOfYear],
    queryFn: () => getWeekGoalsSummary({ year, weekOfYear }),
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

  const firstDayOfWeek = dayjs().week(weekOfYear).startOf('week').toDate()
  const lastDayOfWeek = dayjs().week(weekOfYear).endOf('week').toDate()
  const isCurrentWeek = weekOfYear === dayjs().week()

  const completedPercentage = (
    (summary.completed / summary.total) *
    100
  ).toFixed()

  const sortedSummaryByDate = Object.entries(
    summary.goalsCompletionsPerDay
  ).sort(([dateA], [dateB]) => dayjs(dateB).valueOf() - dayjs(dateA).valueOf())

  return (
    <div className="max-w-[480px] py-10 px-5 mx-auto flex flex-col gap-6">
      <div className="relative flex justify-between items-center">
        <button
          type="button"
          className="absolute left-0 p-1.5 -ml-8 text-zinc-500 enabled:hover:text-zinc-400 disabled:opacity-40"
          onClick={onWeekDecreasing}
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon />

            <span className="text-lg font-semibold">
              {formatDateRange(firstDayOfWeek, lastDayOfWeek)}
            </span>
          </div>

          <Button
            size="sm"
            disabled={!isCurrentWeek}
            onClick={onCreateGoalTrigger}
            className="disabled:opacity-0"
          >
            <Plus className="size-4" />
            Create goal
          </Button>
        </div>

        <button
          type="button"
          className="absolute right-0 p-1.5 -mr-8 text-zinc-500 enabled:hover:text-zinc-400 disabled:opacity-40"
          onClick={onWeekIncreasing}
          disabled={isCurrentWeek}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {summary.total > 0 && (
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
      )}

      <Separator />

      {isCurrentWeek && (
        <PendingGoals
          weekOfYear={weekOfYear}
          year={year}
          onManageGoalsTrigger={onManageGoalsTrigger}
        />
      )}

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Your week</h2>

        {sortedSummaryByDate.length === 0 ? (
          <div className="text-sm text-gray-400">
            {summary.total > 0 ? (
              <p>You haven't completed any goals this week.</p>
            ) : (
              <p>You didn't have any goals to complete this week.</p>
            )}
          </div>
        ) : (
          sortedSummaryByDate.map(([date, goalsCompletions]) => {
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
                  <span className="text-zinc-400 text-xs">
                    ({formattedDate})
                  </span>
                </h3>

                <ul className="flex flex-col gap-3">
                  {sortedGoalsCompletionsByCompletedAt.map(goalCompletion => {
                    return (
                      <GoalCompletion
                        key={goalCompletion.id}
                        goalId={goalCompletion.goalId}
                        completionId={goalCompletion.id}
                        title={goalCompletion.title}
                        completedOn={date}
                        completedAt={goalCompletion.completedAt}
                        year={year}
                        weekOfYear={weekOfYear}
                      />
                    )
                  })}
                </ul>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
