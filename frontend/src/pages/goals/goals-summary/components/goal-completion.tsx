import { deleteGoalCompletion } from '../../../../http/delete-goal-completion'
import { Modal } from '../../../../components/modal'
import { DeleteGoalCompletionModal } from '../modals/delete-goal-completion-modal'
import { EditGoalCompletionModal } from '../modals/edit-goal-completion-modal'
import { updateGoalCompletion } from '../../../../http/update-goal-completion'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, CircleMinus, Pencil } from 'lucide-react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

interface GoalCompletionProps {
  goalId: string
  completionId: string
  title: string
  completedOn: string
  completedAt: string
  year: number
  weekOfYear: number
}

export function GoalCompletion({
  goalId,
  completionId,
  title,
  completedOn,
  completedAt,
  year,
  weekOfYear,
}: GoalCompletionProps) {
  enum ModalType {
    NONE = 0,
    EDIT = 1,
    DELETE = 2,
  }

  const [openModal, setOpenModal] = useState(ModalType.NONE)
  const queryClient = useQueryClient()
  const formattedTime = dayjs(completedAt, 'HH:mm:ss').format('h:mma')

  async function handleDeleteGoalCompletion(
    goalId: string,
    completionId: string
  ) {
    await deleteGoalCompletion({ goalId, completionId })

    queryClient.invalidateQueries({ queryKey: ['summary', year, weekOfYear] })
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
  }

  async function handleUpdateGoalCompletion(
    goalId: string,
    completionId: string,
    completedOn: string,
    completedAt: string
  ) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const formattedDate = dayjs
      .tz(`${completedOn} ${completedAt}`, timezone)
      .tz('UTC')
      .format('YYYY-MM-DD HH:mm:ss.SSSSSSZZ')

    await updateGoalCompletion({
      goalId,
      completionId,
      completedAt: formattedDate,
    })

    queryClient.invalidateQueries({ queryKey: ['summary', year, weekOfYear] })
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })

    setOpenModal(ModalType.NONE)
  }

  return (
    <Modal
      key={completionId}
      open={openModal !== ModalType.NONE}
      onOpenChange={() => {
        setOpenModal(ModalType.NONE)
      }}
    >
      <li key={completionId} className="group relative flex items-center gap-2">
        <CheckCircle2 className="size-4 text-pink-500" />

        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-zinc-400">
            You have done “<span className="text-zinc-100">{title}</span>” at{' '}
            <span className="text-zinc-100">{formattedTime}</span>
          </span>
        </div>

        <div>
          <div className="absolute h-full top-0 hidden group-hover:flex">
            <div className="flex items-start gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpenModal(ModalType.EDIT)
                }}
                className="text-zinc-500 hover:text-zinc-400 disabled:opacity-40"
              >
                <Pencil className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpenModal(ModalType.DELETE)
                }}
                className="text-xs text-zinc-500 hover:text-red-500 disabled:opacity-40"
              >
                <CircleMinus className="size-4 " />
              </button>
            </div>
          </div>
        </div>
      </li>

      {openModal === ModalType.EDIT && (
        <EditGoalCompletionModal
          onSubmit={(completedAt: string) =>
            handleUpdateGoalCompletion(
              goalId,
              completionId,
              completedOn,
              completedAt
            )
          }
          completedAt={completedAt}
        />
      )}

      {openModal === ModalType.DELETE && (
        <DeleteGoalCompletionModal
          onSubmit={() => handleDeleteGoalCompletion(goalId, completionId)}
        />
      )}
    </Modal>
  )
}
