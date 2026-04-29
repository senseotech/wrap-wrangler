import { cn } from '@/lib/utils';

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/80"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-50">{children}</div>
    </div>
  );
};

const DialogTrigger = ({ children, onClick }) => (
  <span onClick={onClick}>{children}</span>
);

const DialogContent = ({ className, children, ...props }) => (
  <div
    className={cn(
      'bg-[#1a1a18] border border-stone-700 rounded-lg p-6 w-full max-w-md shadow-xl',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const DialogHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props} />
);

const DialogTitle = ({ className, ...props }) => (
  <h2 className={cn('text-lg font-semibold text-stone-100', className)} {...props} />
);

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle };
