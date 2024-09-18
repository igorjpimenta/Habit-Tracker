import { forwardRef, type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type OutlineButtonProps = ComponentProps<'button'>

export const OutlineButton = forwardRef<HTMLButtonElement, OutlineButtonProps>(
  ({ ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={twMerge(
          'flex items-center px-3 py-2 gap-2 leading-none rounded-full border border-dashed border-zinc-800 text-sm text-zinc-300 hover:border-zinc-700 disabled:opacity-40 disabled:pointer-events-none outline-none focus-visible:border-pink-500 ring-pink-500/10 focus-visible:ring-4',
          props.className
        )}
      />
    )
  }
)

OutlineButton.displayName = 'Outline Button'
