import { cn } from "@/lib/utils/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-app border border-border bg-surface p-8",
        className,
      )}
    >
      {children}
    </section>
  );
}
