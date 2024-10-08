import * as DialogPrimitive from '@radix-ui/react-dialog'
import { type ComponentProps, forwardRef } from 'react'

export function Dialog(props: DialogPrimitive.DialogProps) {
  return <DialogPrimitive.Dialog {...props} />
}

export function DialogTrigger(props: DialogPrimitive.DialogTriggerProps) {
  return <DialogPrimitive.DialogTrigger {...props} />
}

export function DialogClose(props: DialogPrimitive.DialogCloseProps) {
  return <DialogPrimitive.DialogClose {...props} />
}

function DialogPortal(props: DialogPrimitive.DialogPortalProps) {
  return <DialogPrimitive.DialogPortal {...props} />
}

type DialogOverlayProps = ComponentProps<'div'> &
  DialogPrimitive.DialogOverlayProps

const DialogOverlay = forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ ...props }, ref) => {
    return (
      <DialogPrimitive.DialogOverlay
        {...props}
        ref={ref}
        className="fixed inset-0 bg-black/60"
      />
    )
  }
)

export function DialogContent(props: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.DialogContent
        {...props}
        onPointerDownOutside={e => e.preventDefault()}
        className="fixed right-0 top-0 bottom-0 w-[400px] h-screen border-l border-zinc-900 bg-zinc-950 p-8 overflow-y-auto"
      />
    </DialogPortal>
  )
}

export function DialogTitle(props: DialogPrimitive.DialogTitleProps) {
  return (
    <DialogPrimitive.DialogTitle {...props} className="text-lg font-semibold" />
  )
}

export function DialogDescription(
  props: DialogPrimitive.DialogDescriptionProps
) {
  return (
    <DialogPrimitive.DialogDescription
      {...props}
      className="text-zinc-400 text-sm leading-relaxed"
    />
  )
}
