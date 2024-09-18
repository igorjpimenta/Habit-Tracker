import {
  type ProgressProps,
  type ProgressIndicatorProps,
  Progress as ProgressWrapper,
  Indicator,
} from '@radix-ui/react-progress'

export function Progress(props: ProgressProps) {
  return <ProgressWrapper {...props} className="bg-zinc-900 rounded-full h-2" />
}

export function ProgressIndicator(props: ProgressIndicatorProps) {
  return (
    <Indicator
      {...props}
      className="bg-gradient-to-r from-pink-500 to-violet-500 w-1/2 h-2 rounded-full"
    />
  )
}
