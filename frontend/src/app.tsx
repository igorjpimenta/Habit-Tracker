import logo from './assets/logo.svg'
import letsStart from './assets/lets-start-illustration.svg'

import { Plus } from 'lucide-react'

export function App() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8">
      <img src={logo} alt="in.orbit logo" />

      <img src={letsStart} alt="Let's start illustration" />

      <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
        You haven't created any goal yet, what do you think to create one right
        now?
      </p>

      <button
        type="button"
        className="px-4 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-violet-50 flex items-center gap-2 text-sm font-medium tracking-tight"
      >
        <Plus className="size-4" />
        Create goal
      </button>
    </div>
  )
}
