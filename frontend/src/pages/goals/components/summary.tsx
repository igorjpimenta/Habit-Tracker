import { Button } from '../../../components/button'
import { DialogTrigger } from '../../../components/dialog'
import { Icon } from '../../../components/icon'
import { Progress, ProgressIndicator } from '../../../components/progress-bar'
import { Separator } from '../../../components/separator'
import { OutlineButton } from '../../../components/outline-button'
import { getWeekSummary } from '../../../http/get-week-summary'

import { CheckCircle2, Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
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

  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const completedPercentage = (
    (summary.completed / summary.total) *
    100
  ).toFixed()

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

      <div className="flex flex-wrap gap-3">
        <OutlineButton>
          <Plus className="size-4 text-zinc-400" />
          Pratice yoga
        </OutlineButton>

        <OutlineButton>
          <Plus className="size-4 text-zinc-400" />
          Workout
        </OutlineButton>

        <OutlineButton>
          <Plus className="size-4 text-zinc-400" />
          Make the bed
        </OutlineButton>

        <OutlineButton disabled>
          <Plus className="size-4 text-zinc-400" />
          Read books
        </OutlineButton>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Your week</h2>

        {Object.entries(summary.goalsCompletionsPerDay).map(([date, goals]) => {
          const weekDay = dayjs(date).format('dddd')
          const formattedDate = dayjs(date).format('MMMM D')

          return (
            <div key={date} className="flex flex-col gap-4">
              <h3 className="font-medium">
                {weekDay}{' '}
                <span className="text-zinc-400 text-xs">({formattedDate})</span>
              </h3>

              <ul className="flex flex-col gap-3">
                {goals.map(goal => {
                  const formattedTime = dayjs(
                    goal.completedAt,
                    'HH:mm:ss'
                  ).format('h:mma')

                  return (
                    <li key={goal.id} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-pink-500" />

                      <span className="text-sm text-zinc-400">
                        You have done "
                        <span className="text-zinc-100">{goal.title}</span>" at{' '}
                        <span className="text-zinc-100">{formattedTime}</span>
                      </span>

                      <button
                        type="button"
                        className="text-xs text-zinc-500 underline"
                      >
                        Undo
                      </button>
                    </li>
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
