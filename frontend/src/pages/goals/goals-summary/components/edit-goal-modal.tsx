import {
  ModalContent,
  ModalDescription,
  ModalTitle,
} from '../../../../components/modal'
import {
  updateGoalForm,
  type UpdateGoalForm,
  type HandleUpdateGoalProps,
} from './manage-goals-dialog'
import { Button } from '../../../../components/button'
import { Label } from '../../../../components/label'
import { Input } from '../../../../components/input'
import {
  SelectRoot,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '../../../../components/select'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface EditGoalModalProps extends HandleUpdateGoalProps {
  onSubmit: ({
    goalId,
    title,
    desiredWeeklyFrequency,
  }: HandleUpdateGoalProps) => Promise<void>
}

export function EditGoalModal({
  goalId,
  title,
  desiredWeeklyFrequency,
  onSubmit,
}: EditGoalModalProps) {
  const { register, control, handleSubmit, formState } =
    useForm<UpdateGoalForm>({
      resolver: zodResolver(updateGoalForm),
      defaultValues: { title, desiredWeeklyFrequency },
    })

  return (
    <>
      <ModalContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <ModalTitle>Edit goal</ModalTitle>
            </div>

            <ModalDescription>
              Make changes to your goal here. Click save when you're done.
            </ModalDescription>

            <form
              onSubmit={handleSubmit(data => {
                onSubmit({ goalId, ...data })
              })}
              className="flex-1 flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">Which activity?</Label>

                  <Input
                    id="title"
                    autoFocus
                    placeholder="Workout, pratice yoga, etc..."
                    {...register('title')}
                  />

                  {formState.errors.title && (
                    <p className="text-red-400 text-sm">
                      {formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="desiredWeeklyFrequency">
                    How many times a week?
                  </Label>

                  <Controller
                    control={control}
                    name="desiredWeeklyFrequency"
                    defaultValue={5}
                    render={({ field }) => {
                      return (
                        <SelectRoot
                          onValueChange={field.onChange}
                          value={String(field.value)}
                        >
                          <SelectTrigger
                            id="desiredWeeklyFrequency"
                            placeholder="Desired frequency"
                          />

                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="1">
                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                  Once a week
                                </span>

                                <span className="text-lg leading-none">🥱</span>
                              </SelectItem>

                              <SelectItem value="2">
                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                  Twice a week
                                </span>

                                <span className="text-lg leading-none">🙂</span>
                              </SelectItem>

                              <SelectItem value="3">
                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                  Three times a week
                                </span>

                                <span className="text-lg leading-none">😎</span>
                              </SelectItem>

                              <SelectItem value="4">
                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                  Four times a week
                                </span>

                                <span className="text-lg leading-none">😜</span>
                              </SelectItem>

                              <SelectItem value="5">
                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                  Five times a week
                                </span>

                                <span className="text-lg leading-none">🤨</span>
                              </SelectItem>

                              <SelectItem value="6">
                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                  Six times a week
                                </span>

                                <span className="text-lg leading-none">🤯</span>
                              </SelectItem>

                              <SelectItem value="7">
                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                  Every single day
                                </span>

                                <span className="text-lg leading-none">🔥</span>
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </SelectRoot>
                      )
                    }}
                  />
                </div>
              </div>

              <Button type="submit" className="flex-1">
                Save
              </Button>
            </form>
          </div>
        </div>
      </ModalContent>
    </>
  )
}
