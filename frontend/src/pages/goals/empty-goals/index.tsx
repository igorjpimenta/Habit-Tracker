import logo from '../../../assets/logo.svg'
import letsStart from '../../../assets/lets-start-illustration.svg'
import { Button } from '../../../components/button'
import { DialogTrigger } from '../../../components/dialog'

import { Plus } from 'lucide-react'

export function EmptyGoals() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8">
      <img src={logo} alt="in.orbit logo" />

      <img src={letsStart} alt="Let's start illustration" />

      <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
        You haven't created any goal yet, what do you think to create one right
        now?
      </p>

      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Create goal
        </Button>
      </DialogTrigger>
    </div>
  )
}
