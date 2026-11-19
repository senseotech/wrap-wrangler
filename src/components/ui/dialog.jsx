import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogDescription = DialogPrimitive.Description;

const DialogContent = ({ className, ...props }) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
    <DialogPrimitive.Content
      className={cn(
        'fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-lg border border-stone-700 bg-[#1a1a18] p-6 shadow-xl',
        className
      )}
      {...props}
    />
  </DialogPrimitive.Portal>
);

const DialogHeader = ({ className, ...props }) => (
  <div className={cn('mb-4 flex items-center justify-between gap-2', className)} {...props} />
);

const DialogTitle = ({ className, ...props }) => (
  <DialogPrimitive.Title
    className={cn('text-lg font-semibold text-stone-100', className)}
    {...props}
  />
);

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger };
