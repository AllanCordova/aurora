"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      closeButton
      richColors={false}
      toastOptions={{
        classNames: {
          toast:
            "rounded-app border border-border bg-surface text-foreground shadow-(--shadow-card)",
          title: "text-sm font-semibold text-foreground",
          description: "text-sm text-muted-foreground",
          success: "border-border bg-success-surface text-success",
          error: "border-border bg-danger-surface text-danger",
          info: "border-border bg-surface-muted text-foreground",
          closeButton:
            "border-border bg-surface text-muted-foreground hover:bg-surface-muted",
        },
      }}
    />
  );
}
