import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../../../components/dialog'
import { getWeekPendingGoals } from '../../../../http/get-week-pending-goals'
import { Modal } from '../../../../components/modal'
import { updateGoal } from '../../../../http/update-goal'
import { EditGoalModal } from './edit-goal-modal'
import { deleteGoal } from '../../../../http/delete-goal'
import { DeleteGoalModal } from './delete-goal-modal'

import { CircleMinus, CircleX, X } from 'lucide-react'
import { z } from 'zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export const updateGoalForm = z.object({
  title: z.string().min(1, 'Please inform the activity you wish to do.'),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
})

interface ManageGoalsDialogProps {
  year: number
  weekOfYear: number
}

export type UpdateGoalForm = z.infer<typeof updateGoalForm>

export interface HandleUpdateGoalProps extends UpdateGoalForm {
  goalId: string
}

export interface HandleDeleteGoalProps {
  goalId: string
}

export function ManageGoalsDialog({
  year,
  weekOfYear,
}: ManageGoalsDialogProps) {
  enum ModalType {
    NONE = 0,
    EDIT_GOAL = 1,
    DELETE_GOAL = 2,
  }

  const [openModal, setOpenModal] = useState(ModalType.NONE)

  function handleOpenEditGoalModal(goalId: string) {
    setCurrentGoal(goalId)
    setOpenModal(ModalType.EDIT_GOAL)
  }

  function handleOpenDeleteGoalModal(goalId: string) {
    setCurrentGoal(goalId)
    setOpenModal(ModalType.DELETE_GOAL)
  }

  const queryClient = useQueryClient()
  const [currentGoal, setCurrentGoal] = useState<string | null>(null)

  const { data: pendingGoals } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: getWeekPendingGoals,
    staleTime: 1000 * 60,
  })

  if (!pendingGoals) {
    return null
  }

  const sortedPendingGoals = pendingGoals.sort((a, b) => {
    return a.title.localeCompare(b.title)
  })

  function handleCancelEditing() {
    setCurrentGoal(null)
  }

  function handleCancelDeleting() {
    setCurrentGoal(null)
  }

  async function handleUpdateGoal({
    goalId,
    title,
    desiredWeeklyFrequency,
  }: HandleUpdateGoalProps) {
    await updateGoal({ goalId, title, desiredWeeklyFrequency })

    queryClient.invalidateQueries({ queryKey: ['summary', year, weekOfYear] })
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })

    setOpenModal(ModalType.NONE)
    setCurrentGoal(null)
  }

  async function handleDeleteGoal({ goalId }: HandleDeleteGoalProps) {
    await deleteGoal({ goalId })

    queryClient.invalidateQueries({ queryKey: ['summary', year, weekOfYear] })
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })

    setOpenModal(ModalType.NONE)
    setCurrentGoal(null)
  }

  return (
    <DialogContent>
      <div className="h-full flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <DialogTitle>Manage your goals</DialogTitle>

            <DialogClose>
              <X className="size-5 text-zinc-600" />
            </DialogClose>
          </div>

          <DialogDescription>
            Edit your goals to update the title and desired weekly frequency for
            each goal, or delete some that you no longer need to keep your focus
            sharp.
          </DialogDescription>
        </div>

        <div className="flex flex-col gap-2">
          {sortedPendingGoals.map(goal => {
            return (
              <Modal
                key={goal.id}
                open={currentGoal === goal.id && openModal !== ModalType.NONE}
                onOpenChange={() => {
                  setOpenModal(ModalType.NONE)
                  setCurrentGoal(null)
                }}
              >
                <div
                  data-active={goal.id === currentGoal}
                  data-busy={currentGoal !== null}
                  className="group"
                >
                  <div className="flex justify-between gap-1.5 ">
                    <div className="flex min-w-0 flex-1 rounded-full border border-dashed text-zinc-300 border-zinc-800 px-4 group-data-[busy=false]:hover:border-zinc-700 group-data-[active=true]:border-pink-500 group-data-[busy=false]:group-data-[active=false]:cursor-pointer group-data-[busy=true]:group-data-[active=false]:cursor-default group-data-[busy=true]:group-data-[active=false]:opacity-60 focus-visible:ring-4 ring-pink-500/10">
                      <div
                        onMouseUp={() => {
                          if (currentGoal === null) {
                            handleOpenEditGoalModal(goal.id)
                          }
                        }}
                        className="disabled:pointer-events-none flex items-center flex-1 h-[40px] text-sm truncate leading-tight bg-transparent outline-none placeholder-zinc-400 placeholder:font-normal"
                      >
                        {goal.title}
                      </div>
                    </div>

                    {goal.id === currentGoal ? (
                      <button
                        type="button"
                        onClick={handleCancelEditing}
                        className="text-zinc-500 hover:text-red-500"
                      >
                        <CircleX className="size-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={currentGoal !== null}
                        onClick={() => {
                          if (currentGoal === null) {
                            handleOpenDeleteGoalModal(goal.id)
                          }
                        }}
                        className="text-zinc-500 enabled:hover:text-red-500 disabled:opacity-40"
                      >
                        <CircleMinus className="size-4 " />
                      </button>
                    )}
                  </div>
                </div>

                {openModal === ModalType.EDIT_GOAL && (
                  <EditGoalModal
                    onSubmit={handleUpdateGoal}
                    goalId={goal.id}
                    {...goal}
                  />
                )}

                {openModal === ModalType.DELETE_GOAL && (
                  <DeleteGoalModal
                    onSubmit={handleDeleteGoal}
                    onCancel={handleCancelDeleting}
                    goalId={goal.id}
                  />
                )}
              </Modal>
            )
          })}
        </div>
      </div>
    </DialogContent>
  )
}
