import { Dialog } from '../../components/dialog'
import { CreateGoalDialog } from './components/create-goal-dialog'
// import { EmptyGoals } from './components/empty-goals'
import { Summary } from './components/summary'

export function Goals() {
  return (
    <Dialog>
      {/* <EmptyGoals /> */}
      <Summary />

      <CreateGoalDialog />
    </Dialog>
  )
}
