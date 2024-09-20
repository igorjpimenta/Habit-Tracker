import { Dialog } from '../../components/dialog'
import { CreateGoalDialog } from './components/create-goal-dialog'
import { EmptyGoals } from './empty-goals'
import { GoalsSummary } from './goals-summary'
import { getWeekGoalsSummary } from '../../http/get-week-goals-summary'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(customParseFormat)
dayjs.extend(weekOfYear)

export function Goals() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(dayjs().week())
  const [currentYear, setCurrentYear] = useState(dayjs().year())

  const { data: summary } = useQuery({
    queryKey: ['summary', currentYear, currentWeek],
    queryFn: () =>
      getWeekGoalsSummary({ weekOfYear: currentWeek, year: currentYear }),
    staleTime: 1000 * 60,
  })

  function handleCloseDialog() {
    setDialogOpen(false)
  }

  function handleDecreaseCurrentWeek() {
    if (currentWeek === 1) {
      setCurrentYear(currentYear - 1)
    }

    setCurrentWeek(currentWeek - 1)
  }

  function handleIncreaseCurrentWeek() {
    setCurrentWeek(currentWeek + 1)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      {summary?.allTimeTotal ? (
        <GoalsSummary
          weekOfYear={currentWeek}
          year={currentYear}
          onWeekDecreasing={handleDecreaseCurrentWeek}
          onWeekIncreasing={handleIncreaseCurrentWeek}
        />
      ) : (
        <EmptyGoals />
      )}

      <CreateGoalDialog
        onCreateGoal={handleCloseDialog}
        weekOfYear={currentWeek}
        year={currentYear}
      />
    </Dialog>
  )
}
