import { GoalCompletion } from '../components/goal-completion'
import { getWeekGoalsSummary } from '../../../../http/get-week-goals-summary'

import { useQuery } from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'

interface GoalCompletions {
  year: number
  weekOfYear: number
}

export function GoalCompletions({ year, weekOfYear }: GoalCompletions) {
  const { data: summary } = useQuery({
    queryKey: ['summary', year, weekOfYear],
    queryFn: () => getWeekGoalsSummary({ year, weekOfYear }),
    staleTime: 1000 * 60,
  })

  if (!summary) {
    return null
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

  const sortedSummaryByDate = Object.entries(
    summary.goalsCompletionsPerDay
  ).sort(([dateA], [dateB]) => dayjs(dateB).valueOf() - dayjs(dateA).valueOf())

  return (
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
                <span className="text-zinc-400 text-xs">({formattedDate})</span>
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
  )
}
