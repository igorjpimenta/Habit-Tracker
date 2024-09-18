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

import { X } from 'lucide-react'

export function CreateGoalDialog() {
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

        <form action="#" className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Which activity?</Label>

              <Input
                id="title"
                autoFocus
                placeholder="Workout, pratice yoga, etc..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Which activity?</Label>

              <RadioGroup>
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
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DialogClose asChild>
              <Button type="button" className="flex-1" variant="secondary">
                Close
              </Button>
            </DialogClose>

            <Button className="flex-1">Save</Button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}
