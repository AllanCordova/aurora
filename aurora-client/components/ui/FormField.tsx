"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: { message?: string };
  registration: UseFormRegisterReturn;
};

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  error,
  registration,
}: FormFieldProps) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        hasError={Boolean(error)}
        {...registration}
      />
      {error?.message && (
        <p className="mt-2 text-sm text-danger">{error.message}</p>
      )}
    </div>
  );
}
