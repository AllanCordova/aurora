import { cn } from "@/lib/utils/cn";

type BadgeVariant = "success" | "muted";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-success-surface text-success",
  muted: "bg-surface-muted text-muted-foreground",
};

export function Badge({ children, variant = "muted" }: BadgeProps) {
  return (
    <span
      className={cn(
        "rounded-app px-3 py-1 text-xs font-semibold",
        variantClasses[variant],
      )}
    >
      {children}
    </span>
  );
}
