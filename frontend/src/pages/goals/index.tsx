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
  enum DialogType {
    NONE = 0,
    CREATE_GOAL = 1,
  }

  const [openDialog, setOpenDialog] = useState<DialogType>(DialogType.NONE)

  function handleOpenCreateGoalDialog() {
    setOpenDialog(DialogType.CREATE_GOAL)
  }

  const [currentWeek, setCurrentWeek] = useState(dayjs().week())
  const [currentYear, setCurrentYear] = useState(dayjs().year())

  const { data: summary } = useQuery({
    queryKey: ['summary', currentYear, currentWeek],
    queryFn: () =>
      getWeekGoalsSummary({ weekOfYear: currentWeek, year: currentYear }),
    staleTime: 1000 * 60,
  })

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
    <Dialog
      open={openDialog !== DialogType.NONE}
      onOpenChange={() => setOpenDialog(DialogType.NONE)}
    >
      {summary?.allTimeTotal ? (
        <GoalsSummary
          weekOfYear={currentWeek}
          year={currentYear}
          onCreateGoalTrigger={handleOpenCreateGoalDialog}
          onWeekDecreasing={handleDecreaseCurrentWeek}
          onWeekIncreasing={handleIncreaseCurrentWeek}
        />
      ) : (
        <EmptyGoals onCreateGoalTrigger={handleOpenCreateGoalDialog} />
      )}

      {openDialog === DialogType.CREATE_GOAL && (
        <CreateGoalDialog
          onSubmit={() => setOpenDialog(DialogType.NONE)}
          weekOfYear={currentWeek}
          year={currentYear}
        />
      )}
    </Dialog>
  )
}
