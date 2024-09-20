import { deleteGoalCompletion } from '../../../../http/delete-goal-completion'

import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2 } from 'lucide-react'

interface GoalCompletionProps {
  completionId: string
  goalId: string
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

      <span className="text-sm text-zinc-400">
        You have done "<span className="text-zinc-100">{title}</span>" at{' '}
        <span className="text-zinc-100">{completedAt}</span>
      </span>

      <button
        type="button"
        onClick={() => handleDeleteGoalCompletion(goalId, completionId)}
        className="text-xs text-zinc-500 underline"
      >
        Undo
      </button>
    </li>
  )
}
