import { AnimatedFeedback } from "@/components/motion/AnimatedFeedback";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils/cn";

type ErrorShowProps = {
  error?: Error | null;
  className?: string;
};

function getErrorMessage(error: Error): string {
  if (error instanceof ApiError && error.errors) {
    const firstFieldError = Object.values(error.errors).flat()[0];
    if (firstFieldError) {
      return firstFieldError;
    }
  }

  return error.message;
}

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
          {getErrorMessage(error)}
        </div>
      )}
    </AnimatedFeedback>
  );
}
