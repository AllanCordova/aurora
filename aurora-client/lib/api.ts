import axios, { AxiosError, type AxiosInstance } from "axios";
import { useAuthStore } from "@/lib/stores/auth-store";

export type ApiValidationErrors = Record<string, string[]>;

export class ApiError extends Error {
  status: number;
  errors?: ApiValidationErrors;

  constructor(message: string, status: number, errors?: ApiValidationErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

type LaravelErrorPayload = {
  message?: string;
  errors?: ApiValidationErrors;
};

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<LaravelErrorPayload>;
    const payload = axiosError.response?.data;
    const validationMessage = payload?.errors
      ? Object.values(payload.errors).flat()[0]
      : undefined;

    return new ApiError(
      validationMessage ?? payload?.message ?? axiosError.message ?? "Request failed.",
      axiosError.response?.status ?? 500,
      payload?.errors,
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500);
  }

  return new ApiError("Unexpected error.", 500);
}

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(handleApiError(error)),
  );

  return client;
}

export const api = createApiClient();
