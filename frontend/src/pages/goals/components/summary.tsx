import { Button } from '../../../components/button'
import { DialogTrigger } from '../../../components/dialog'
import { Icon } from '../../../components/icon'
import { Progress, ProgressIndicator } from '../../../components/progress-bar'
import { Separator } from '../../../components/separator'
import { OutlineButton } from '../../../components/outline-button'

import { CheckCircle2, Plus } from 'lucide-react'

export function Summary() {
  return (
    <div className="max-w-[480px] py-10 px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon />

          <span className="text-lg font-semibold">August 5 to 10</span>
        </div>

        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Create goal
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress value={8} max={15}>
          <ProgressIndicator style={{ width: '50%' }} />
        </Progress>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            You have done <span className="text-zinc-100">8</span> of{' '}
            <span className="text-zinc-100">15</span> goals this week.
          </span>

          <span>58%</span>
        </div>
      </div>

      <Separator />

      <div className="flex flex-wrap gap-3">
        <OutlineButton>
          <Plus className="size-4 text-zinc-400" />
          Pratice yoga
        </OutlineButton>

        <OutlineButton>
          <Plus className="size-4 text-zinc-400" />
          Workout
        </OutlineButton>

        <OutlineButton>
          <Plus className="size-4 text-zinc-400" />
          Make the bed
        </OutlineButton>

        <OutlineButton disabled>
          <Plus className="size-4 text-zinc-400" />
          Read books
        </OutlineButton>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Your week</h2>

        <div className="flex flex-col gap-4">
          <h3 className="font-medium">
            Sunday <span className="text-zinc-400 text-xs">(August 10)</span>
          </h3>

          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-pink-500" />

              <span className="text-sm text-zinc-400">
                You have done "
                <span className="text-zinc-100">Wake up earlier</span>" at{' '}
                <span className="text-zinc-100">08:13a.m.</span>
              </span>

              <button type="button" className="text-xs text-zinc-500 underline">
                Undo
              </button>
            </li>

            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-pink-500" />

              <span className="text-sm text-zinc-400">
                You have done "
                <span className="text-zinc-100">Wake up earlier</span>" at{' '}
                <span className="text-zinc-100">08:13a.m.</span>
              </span>

              <button type="button" className="text-xs text-zinc-500 underline">
                Undo
              </button>
            </li>

            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-pink-500" />

              <span className="text-sm text-zinc-400">
                You have done "
                <span className="text-zinc-100">Wake up earlier</span>" at{' '}
                <span className="text-zinc-100">08:13a.m.</span>
              </span>

              <button type="button" className="text-xs text-zinc-500 underline">
                Undo
              </button>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-medium">
            Monday <span className="text-zinc-400 text-xs">(August 11)</span>
          </h3>

          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-pink-500" />

              <span className="text-sm text-zinc-400">
                You have done "
                <span className="text-zinc-100">Wake up earlier</span>" at{' '}
                <span className="text-zinc-100">08:13a.m.</span>
              </span>

              <button type="button" className="text-xs text-zinc-500 underline">
                Undo
              </button>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-medium">
            Tuesday <span className="text-zinc-400 text-xs">(August 12)</span>
          </h3>

          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-pink-500" />

              <span className="text-sm text-zinc-400">
                You have done "
                <span className="text-zinc-100">Wake up earlier</span>" at{' '}
                <span className="text-zinc-100">08:13a.m.</span>
              </span>

              <button type="button" className="text-xs text-zinc-500 underline">
                Undo
              </button>
            </li>

            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-pink-500" />

              <span className="text-sm text-zinc-400">
                You have done "
                <span className="text-zinc-100">Wake up earlier</span>" at{' '}
                <span className="text-zinc-100">08:13a.m.</span>
              </span>

              <button type="button" className="text-xs text-zinc-500 underline">
                Undo
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
