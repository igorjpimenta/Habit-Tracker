import { forwardRef } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export function SelectRoot(props: SelectPrimitive.SelectProps) {
  return <SelectPrimitive.Root {...props} />
}

export function SelectPortal(props: SelectPrimitive.SelectPortalProps) {
  return <SelectPrimitive.Portal {...props} />
}

const SelectIcon = forwardRef<
  HTMLSpanElement,
  SelectPrimitive.SelectIconProps & { Icon?: LucideIcon }
>(({ Icon = ChevronDown, ...props }, forwardedRef) => {
  return (
    <SelectPrimitive.Icon ref={forwardedRef} {...props}>
      <Icon className="size-5 shrink-0" />
    </SelectPrimitive.Icon>
  )
})

export const SelectTrigger = forwardRef<
  HTMLButtonElement,
  SelectPrimitive.SelectTriggerProps &
    SelectPrimitive.SelectValueProps & { Icon?: LucideIcon }
>(({ Icon, placeholder, className, ...props }, forwardedRef) => {
  return (
    <SelectPrimitive.Trigger
      ref={forwardedRef}
      className={twMerge(
        'flex items-center justify-between px-4 h-12 bg-black border border-zinc-900 rounded-lg placeholder-zinc-400 outline-none text-sm hover:border-zinc-800 focus-visible:border-pink-500 focus-visible:bg-pink-500/5 focus-visible:ring-4 ring-pink-500/10',
        className
      )}
      {...props}
    >
      <SelectPrimitive.Value
        data-radix-select-trigger-value
        placeholder={placeholder}
      />

      <SelectIcon Icon={Icon} />
    </SelectPrimitive.Trigger>
  )
})

const SelectScrollUpButton = forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectScrollUpButtonProps & { Icon?: LucideIcon }
>(({ Icon = ChevronUp, ...props }, forwardRef) => {
  return (
    <SelectPrimitive.ScrollUpButton
      ref={forwardRef}
      className="flex items-center justify-center h-[25px] bg-inherit text-zinc-600 cursor-default"
      {...props}
    >
      <Icon className="size-5" />
    </SelectPrimitive.ScrollUpButton>
  )
})

const SelectViewport = forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectViewportProps
>(({ ...props }, forwardedRef) => {
  return <SelectPrimitive.Viewport ref={forwardedRef} {...props} />
})

const SelectScrollDownButton = forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectScrollDownButtonProps & { Icon?: LucideIcon }
>(({ Icon = ChevronDown, ...props }, forwardRef) => {
  return (
    <SelectPrimitive.ScrollDownButton
      ref={forwardRef}
      className="flex items-center justify-center h-6 bg-inherit text-zinc-600 cursor-default"
      {...props}
    >
      <Icon className="size-5" />
    </SelectPrimitive.ScrollDownButton>
  )
})

export const SelectContent = forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectContentProps
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <SelectPortal>
      <SelectPrimitive.Content
        ref={forwardedRef}
        className={twMerge(
          'ml-5 bg-zinc-950 border border-zinc-800 rounded-lg',
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />

        <SelectViewport>{children}</SelectViewport>

        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPortal>
  )
})

export const SelectLabel = forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectLabelProps
>(({ ...props }, forwardedRef) => {
  return (
    <SelectPrimitive.Label
      ref={forwardedRef}
      className="px-6 text-xs text-zinc-500 font-medium leading-loose"
      {...props}
    />
  )
})

export const SelectGroup = forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectGroupProps
>(({ ...props }, forwardedRef) => {
  return <SelectPrimitive.Group {...props} ref={forwardedRef} />
})

const SelectItemText = forwardRef<
  HTMLSpanElement,
  SelectPrimitive.SelectItemTextProps
>(({ ...props }, forwardedRef) => {
  return (
    <SelectPrimitive.ItemText
      style={{ width: '100%' }}
      ref={forwardedRef}
      {...props}
    />
  )
})

export const SelectItem = forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectItemProps & { Icon?: LucideIcon }
>(({ Icon = CheckCircle2, children, className, ...props }, forwardedRef) => {
  return (
    <SelectPrimitive.Item
      ref={forwardedRef}
      className={twMerge(
        'relative flex w-full items-center text-sm leading-none rounded-lg py-2.5 px-9 select-none data-[highlighted]:cursor-pointer data-[disabled]:text-zinc-600 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:border data-[highlighted]:border-pink-500 data-[highlighted]:bg-pink-500/5',
        className
      )}
      {...props}
    >
      <SelectItemText>
        <div className="flex items-center justify-between">{children}</div>
      </SelectItemText>

      <SelectPrimitive.ItemIndicator
        data-radix-select-item-indicator
        className="absolute left-0 w-9 flex items-center justify-center"
      >
        <Icon className="size-4 text-pink-500" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
})

export const SelectSeparator = forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectSeparatorProps
>(({ ...props }, forwardRef) => {
  return (
    <SelectPrimitive.Separator
      ref={forwardRef}
      className="h-px bg-zinc-600 my-2 mx-[5%] rounded-full"
      {...props}
    />
  )
})
