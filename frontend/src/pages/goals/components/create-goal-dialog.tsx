import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../../components/dialog'
import { Label } from '../../../components/label'
import { Input } from '../../../components/input'
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from '../../../components/radio-group'
import { Button } from '../../../components/button'
import { createGoal } from '../../../http/create-goal'

import { X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'

const createGoalForm = z.object({
  title: z.string().min(1, 'Please inform the activity you wish to do.'),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
})

type CreateGoalForm = z.infer<typeof createGoalForm>

interface CreateGoalDialogProps {
  onSubmit: () => void
  year: number
  weekOfYear: number
}

export function CreateGoalDialog({
  onSubmit,
  year,
  weekOfYear,
}: CreateGoalDialogProps) {
  const queryClient = useQueryClient()

  const { register, control, handleSubmit, formState, reset } =
    useForm<CreateGoalForm>({
      resolver: zodResolver(createGoalForm),
    })

  async function handleCreateGoal({
    title,
    desiredWeeklyFrequency,
  }: CreateGoalForm) {
    await createGoal({ title, desiredWeeklyFrequency })

    queryClient.invalidateQueries({ queryKey: ['summary', year, weekOfYear] })
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })

    reset()
    onSubmit()
  }

  return (
    <DialogContent>
      <div className="h-full flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <DialogTitle>Create goal</DialogTitle>

            <DialogClose>
              <X className="size-5 text-zinc-600" />
            </DialogClose>
          </div>

          <DialogDescription>
            Add tasks that make you feel good and that you want to do every
            week, plus bad habits that you want to stop doing too.
          </DialogDescription>
        </div>

        <form
          onSubmit={handleSubmit(handleCreateGoal)}
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
                    <RadioGroup
                      id="desiredWeeklyFrequency"
                      onValueChange={field.onChange}
                      value={String(field.value)}
                    >
                      <RadioGroupItem value="1">
                        <RadioGroupIndicator />

                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          Once a week
                        </span>

                        <span className="text-lg leading-none">🥱</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="2">
                        <RadioGroupIndicator />

                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          Twice a week
                        </span>

                        <span className="text-lg leading-none">🙂</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="3">
                        <RadioGroupIndicator />

                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          Three times a week
                        </span>

                        <span className="text-lg leading-none">😎</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="4">
                        <RadioGroupIndicator />

                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          Four times a week
                        </span>

                        <span className="text-lg leading-none">😜</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="5">
                        <RadioGroupIndicator />

                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          Five times a week
                        </span>

                        <span className="text-lg leading-none">🤨</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="6">
                        <RadioGroupIndicator />

                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          Six times a week
                        </span>

                        <span className="text-lg leading-none">🤯</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="7">
                        <RadioGroupIndicator />

                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          Every single day
                        </span>

                        <span className="text-lg leading-none">🔥</span>
                      </RadioGroupItem>
                    </RadioGroup>
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
    </DialogContent>
  )
}
