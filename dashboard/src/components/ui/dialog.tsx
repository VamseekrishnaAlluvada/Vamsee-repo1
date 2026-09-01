import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({
  children,
  className,
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-fade-in-up" />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-4xl -translate-x-1/2 -translate-y-1/2',
          'glass shadow-glow-violet p-6 focus:outline-none data-[state=open]:animate-fade-in-up',
          className,
        )}
      >
        {title && (
          <DialogPrimitive.Title className="heading text-lg mb-4 pr-8">
            {title}
          </DialogPrimitive.Title>
        )}
        <DialogPrimitive.Description className="sr-only">
          {title ?? 'Dialog'}
        </DialogPrimitive.Description>
        {children}
        <DialogPrimitive.Close
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-black/10 hover:text-slate-900"
          aria-label="Close"
        >
          <X size={18} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
