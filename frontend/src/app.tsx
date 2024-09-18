import { Goals } from './pages/goals'
import { queryClient } from './lib/react-query'

import { QueryClientProvider } from '@tanstack/react-query'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Goals />
    </QueryClientProvider>
  )
}
