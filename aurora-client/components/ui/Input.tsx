import { cn } from "@/lib/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export function Input({ className, hasError = false, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-app border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
        hasError ? "border-danger" : "border-input",
        className,
      )}
      {...props}
    />
  );
}
