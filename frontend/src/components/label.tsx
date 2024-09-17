import { forwardRef, type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface LabelProps extends ComponentProps<'label'> {
  htmlFor: string
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ ...props }, ref) => {
    return (
      <label
        {...props}
        ref={ref}
        className={twMerge(
          'font-medium text-sm tracking-tight leading-normal',
          props.className
        )}
      />
    )
  }
)

Label.displayName = 'Label'
