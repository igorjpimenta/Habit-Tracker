import { deleteGoalCompletion } from '../../../../http/delete-goal-completion'

import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2 } from 'lucide-react'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)

interface GoalCompletionProps {
  goalId: string
  completionId: string
  title: string
  completedAt: string
  year: number
  weekOfYear: number
}

export function GoalCompletion({
  goalId,
  completionId,
  title,
  completedAt,
  year,
  weekOfYear,
}: GoalCompletionProps) {
  const queryClient = useQueryClient()
  const isCurrentWeek = weekOfYear === dayjs().week()

  async function handleDeleteGoalCompletion(
    goalId: string,
    completionId: string
  ) {
    await deleteGoalCompletion({ goalId, completionId })

    queryClient.invalidateQueries({ queryKey: ['summary', year, weekOfYear] })
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
  }

  return (
    <li key={completionId} className="flex items-center gap-2">
      <CheckCircle2 className="size-4 text-pink-500" />

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-zinc-400">
          You have done "<span className="text-zinc-100">{title}</span>" at{' '}
          <span className="text-zinc-100">{completedAt}</span>
        </span>

        {isCurrentWeek && (
          <button
            type="button"
            onClick={() => handleDeleteGoalCompletion(goalId, completionId)}
            className="text-xs text-zinc-500 leading-none underline"
          >
            Undo
          </button>
        )}
      </div>
    </li>
  )
}
