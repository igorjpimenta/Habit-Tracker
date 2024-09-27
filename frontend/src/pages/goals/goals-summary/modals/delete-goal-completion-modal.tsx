import {
  ModalContent,
  ModalDescription,
  ModalTitle,
  ModalTrigger,
} from '../../../../components/modal'
import { Button } from '../../../../components/button'

interface DeleteGoalCompletionModalProps {
  onSubmit: () => void
}

export function DeleteGoalCompletionModal({
  onSubmit,
}: DeleteGoalCompletionModalProps) {
  return (
    <ModalContent>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <ModalTitle>Delete goal completion?</ModalTitle>
          </div>

          <ModalDescription>This action can't be undone.</ModalDescription>
        </div>

        <div className="flex items-center justify-between gap-6">
          <ModalTrigger asChild>
            <Button variant="secondary" size="sm" className="flex-1">
              Cancel
            </Button>
          </ModalTrigger>

          <Button
            size="sm"
            className="flex-1 bg-red-500 enabled:hover:bg-red-600"
            onClick={onSubmit}
          >
            Delete
          </Button>
        </div>
      </div>
    </ModalContent>
  )
}
