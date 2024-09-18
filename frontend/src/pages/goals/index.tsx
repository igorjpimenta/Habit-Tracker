import { Dialog } from '../../components/dialog'
import { CreateGoalDialog } from './summary/components/create-goal-dialog'
import { EmptyGoals } from './empty-goals'
import { Summary } from './summary'
import { getWeekSummary } from '../../http/get-week-summary'

import { useQuery } from '@tanstack/react-query'

export function Goals() {
  const { data: summary } = useQuery({
    queryKey: ['summary'],
    queryFn: getWeekSummary,
    staleTime: 1000 * 60,
  })

  return (
    <Dialog>
      {summary?.total ? <Summary /> : <EmptyGoals />}

      <CreateGoalDialog />
    </Dialog>
  )
}
