import { forwardRef, type ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const buttonVariants = tv({
  base: 'flex items-center justify-center gap-2 rounded-lg text-sm font-medium tracking-tight outline-none ring-offset-2 ring-offset-black focus-visible:ring-2 disabled:opacity-40',

  variants: {
    variant: {
      primary:
        'bg-violet-500 text-violet-50 enabled:hover:bg-violet-600 ring-violet-500',
      secondary:
        'bg-zinc-900 text-zinc-400 enabled:hover:bg-zinc-800 ring-zinc-900',
    },

    size: {
      default: 'px-4 py-2.5',
      sm: 'px-3 py-1.5',
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
})

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={buttonVariants({ variant, size, className })}
      />
    )
  }
)

Button.displayName = 'Button'
