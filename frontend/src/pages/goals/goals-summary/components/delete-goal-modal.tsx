import {
  ModalContent,
  ModalDescription,
  ModalTitle,
} from '../../../../components/modal'
import type {
  HandleDeleteGoalProps,
  HandleUpdateGoalProps,
} from './manage-goals-dialog'
import { Button } from '../../../../components/button'

interface DeleteGoalModalProps
  extends Omit<HandleUpdateGoalProps, 'desiredWeeklyFrequency' | 'title'> {
  onSubmit: ({ goalId }: HandleDeleteGoalProps) => Promise<void>
  onCancel: () => void
}

export function DeleteGoalModal({
  goalId,
  onSubmit,
  onCancel,
}: DeleteGoalModalProps) {
  return (
    <ModalContent>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <ModalTitle>Delete goal?</ModalTitle>
          </div>

          <ModalDescription>This action can't be undone.</ModalDescription>
        </div>

        <div className="flex items-center justify-between gap-6">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            size="sm"
            className="flex-1 bg-red-500 enabled:hover:bg-red-600"
            onClick={() => onSubmit({ goalId })}
          >
            Delete
          </Button>
        </div>
      </div>
    </ModalContent>
  )
}
