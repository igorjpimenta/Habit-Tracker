import { OutlineButton } from '../../../../components/outline-button'
import { createGoalCompletion } from '../../../../http/create-goal-completion'
import { deleteGoal } from '../../../../http/delete-goal'
import { updateGoal } from '../../../../http/update-goal'
import { Modal } from '../../../../components/modal'
import { EditGoalModal } from '../modals/edit-goal-modal'
import { DeleteGoalModal } from '../modals/delete-goal-modal'

import { useState } from 'react'
import { CircleMinus, Pencil, Plus } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

interface PendingGoalProps {
  goalId: string
  title: string
  desiredWeeklyFrequency: number
  completed: boolean
  year: number
  weekOfYear: number
}

export function PendingGoal({
  goalId,
  title,
  desiredWeeklyFrequency,
  completed,
  year,
  weekOfYear,
}: PendingGoalProps) {
  enum ModalType {
    NONE = 0,
    EDIT = 1,
    DELETE = 2,
  }

  const [openModal, setOpenModal] = useState(ModalType.NONE)
  const queryClient = useQueryClient()

  async function handleCreateGoalCompletion(goalId: string) {
    await createGoalCompletion({ goalId })

    queryClient.invalidateQueries({ queryKey: ['summary', year, weekOfYear] })
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
  }

  async function handleUpdateGoal(
    goalId: string,
    title: string,
    desiredWeeklyFrequency: number
  ) {
    await updateGoal({ goalId, title, desiredWeeklyFrequency })

    queryClient.invalidateQueries({ queryKey: ['summary', year, weekOfYear] })
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })

    setOpenModal(ModalType.NONE)
  }

  async function handleDeleteGoal(goalId: string) {
    await deleteGoal({ goalId })

    queryClient.invalidateQueries({ queryKey: ['summary', year, weekOfYear] })
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })

    setOpenModal(ModalType.NONE)
  }

  return (
    <Modal
      key={goalId}
      open={openModal !== ModalType.NONE}
      onOpenChange={() => {
        setOpenModal(ModalType.NONE)
      }}
    >
      <div className="group relative flex items-center">
        <OutlineButton
          disabled={completed}
          className="flex-shrink-0"
          onClick={() => handleCreateGoalCompletion(goalId)}
        >
          <Plus className="size-4 text-zinc-400" />
          {title}
        </OutlineButton>

        <div className="hidden group-hover:flex">
          <div className="absolute z-50 h-full top-0 hidden group-hover:flex pl-2 pr-4 bg-gradient-to-r from-zinc-950 via-zinc-950 to-transparent">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpenModal(ModalType.EDIT)
                }}
                className="text-zinc-500 hover:text-zinc-400 disabled:opacity-40 bg-zinc-950"
              >
                <Pencil className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpenModal(ModalType.DELETE)
                }}
                className="text-xs text-zinc-500 hover:text-red-500 disabled:opacity-40 bg-zinc-950"
              >
                <CircleMinus className="size-4 " />
              </button>
            </div>
          </div>
        </div>
      </div>

      {openModal === ModalType.EDIT && (
        <EditGoalModal
          title={title}
          desiredWeeklyFrequency={desiredWeeklyFrequency}
          onSubmit={(title: string, desiredWeeklyFrequency: number) =>
            handleUpdateGoal(goalId, title, desiredWeeklyFrequency)
          }
        />
      )}

      {openModal === ModalType.DELETE && (
        <DeleteGoalModal onSubmit={() => handleDeleteGoal(goalId)} />
      )}
    </Modal>
  )
}
