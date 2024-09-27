import {
  ModalContent,
  ModalDescription,
  ModalTitle,
} from '../../../../components/modal'
import { Button } from '../../../../components/button'
import { Label } from '../../../../components/label'
import { Input } from '../../../../components/input'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import dayjs from 'dayjs'
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from '../../../../components/select'

interface EditGoalCompletionModalProps {
  completedAt: string
  onSubmit: (completedAt: string) => void
}

export function EditGoalCompletionModal({
  completedAt,
  onSubmit,
}: EditGoalCompletionModalProps) {
  const updateGoalCompletionForm = z.object({
    hour: z.coerce
      .number()
      .int()
      .min(1, 'Hour must be between 1 and 12')
      .max(12, 'Hour must be between 1 and 12'),
    minute: z.coerce
      .number()
      .int()
      .min(0, 'Minute must be between 0 and 59')
      .max(59, 'Minute must be between 1 and 59'),
    meridiem: z.enum(['am', 'pm']),
  })

  type UpdateGoalCompletionForm = z.infer<typeof updateGoalCompletionForm>

  const { register, control, handleSubmit, formState } =
    useForm<UpdateGoalCompletionForm>({
      resolver: zodResolver(updateGoalCompletionForm),
      shouldFocusError: true,
      defaultValues: {
        hour: Number.parseInt(dayjs(completedAt, 'HH:mm:ss').format('h')),
        minute: dayjs(completedAt, 'HH:mm:ss').minute(),
        meridiem: dayjs(completedAt, 'HH:mm:ss').format('a') as 'am' | 'pm',
      },
    })

  function handleOnSubmit({
    hour,
    minute,
    meridiem,
  }: UpdateGoalCompletionForm) {
    const completedAt = dayjs(`${hour}:${minute}${meridiem}`, 'h:mma').format(
      'HH:mm:ss'
    )

    onSubmit(completedAt)
  }
  return (
    <>
      <ModalContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <ModalTitle>Edit goal completion</ModalTitle>
            </div>

            <ModalDescription>
              Make changes to your goal completion here. Click save when you're
              done.
            </ModalDescription>

            <form
              onSubmit={handleSubmit(data => {
                handleOnSubmit({ ...data })
              })}
              className="flex-1 flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="hour">When have you completed it?</Label>

                  <div className="group flex items-center gap-2">
                    <Input
                      id="hour"
                      autoFocus
                      className="w-14 text-center p-1"
                      placeholder="HH"
                      {...register('hour')}
                    />

                    <span>:</span>

                    <Controller
                      name="minute"
                      control={control}
                      render={({ field: { onChange, value, ref } }) => (
                        <Input
                          ref={ref}
                          id="minute"
                          className="w-14 text-center p-1"
                          placeholder="mm"
                          value={value?.toString().padStart(2, '0')}
                          onChange={e => onChange(Number(e.target.value))}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="meridiem"
                      defaultValue="am"
                      render={({ field }) => {
                        return (
                          <SelectRoot
                            onValueChange={field.onChange}
                            value={String(field.value)}
                          >
                            <SelectTrigger
                              id="meridiem"
                              className="w-18"
                              placeholder="Desired frequency"
                            />

                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="am">
                                  <span className="text-zinc-300 text-sm font-medium leading-none">
                                    AM
                                  </span>
                                </SelectItem>

                                <SelectItem value="pm">
                                  <span className="text-zinc-300 text-sm font-medium leading-none">
                                    PM
                                  </span>
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </SelectRoot>
                        )
                      }}
                    />
                  </div>

                  {formState.errors.hour && (
                    <p className="text-red-400 text-sm">
                      {formState.errors.hour.message}
                    </p>
                  )}

                  {formState.errors.minute && (
                    <p className="text-red-400 text-sm">
                      {formState.errors.minute.message}
                    </p>
                  )}
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
