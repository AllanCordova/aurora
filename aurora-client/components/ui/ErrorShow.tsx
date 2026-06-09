import { AnimatedFeedback } from "@/components/motion/AnimatedFeedback";
import { getToastErrorMessage } from "@/lib/toast";
import { cn } from "@/lib/utils/cn";

type ErrorShowProps = {
  error?: Error | null;
  className?: string;
};

export function ErrorShow({ error, className }: ErrorShowProps) {
  return (
    <AnimatedFeedback show={Boolean(error)}>
      {error && (
        <div
          className={cn(
            "rounded-app border border-border bg-danger-surface px-4 py-3 text-sm text-danger",
            className,
          )}
          role="alert"
        >
          {getToastErrorMessage(error)}
        </div>
      )}
    </AnimatedFeedback>
  );
}
