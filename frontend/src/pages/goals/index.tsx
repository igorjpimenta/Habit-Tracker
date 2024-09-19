import { Dialog } from '../../components/dialog'
import { CreateGoalDialog } from './components/create-goal-dialog'
import { EmptyGoals } from './empty-goals'
import { GoalsSummary } from './goals-summary'
import { getWeekGoalsSummary } from '../../http/get-week-goals-summary'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export function Goals() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const { data: summary } = useQuery({
    queryKey: ['summary'],
    queryFn: getWeekGoalsSummary,
    staleTime: 1000 * 60,
  })

  function handleCloseDialog() {
    setDialogOpen(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      {summary?.total ? <GoalsSummary /> : <EmptyGoals />}

      <CreateGoalDialog onCreateGoal={handleCloseDialog} />
    </Dialog>
  )
}
