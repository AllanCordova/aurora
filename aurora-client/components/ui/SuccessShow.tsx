import { AnimatedFeedback } from "@/components/motion/AnimatedFeedback";
import { cn } from "@/lib/utils/cn";

type SuccessShowProps = {
  message?: string | null;
  className?: string;
};

export function SuccessShow({ message, className }: SuccessShowProps) {
  return (
    <AnimatedFeedback show={Boolean(message)}>
      {message && (
        <div
          className={cn(
            "rounded-app border border-border bg-success-surface px-4 py-3 text-sm text-success",
            className,
          )}
          role="status"
        >
          {message}
        </div>
      )}
    </AnimatedFeedback>
  );
}
