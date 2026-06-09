import { toast as sonnerToast } from "sonner";
import { ApiError } from "@/lib/api";

export function getToastErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (error instanceof ApiError) {
    if (error.errors) {
      const firstFieldError = Object.values(error.errors).flat()[0];
      if (firstFieldError) {
        return firstFieldError;
      }
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export const toast = {
  success(message: string) {
    sonnerToast.success(message);
  },

  error(error: unknown, fallback?: string) {
    sonnerToast.error(getToastErrorMessage(error, fallback));
  },

  info(message: string) {
    sonnerToast.info(message);
  },
};
