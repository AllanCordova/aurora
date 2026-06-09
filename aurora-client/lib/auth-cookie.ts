import { AUTH_COOKIE_NAME } from "@/lib/constants/auth";

const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

export { AUTH_COOKIE_NAME };

export function setAuthCookie(token: string): void {
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${ONE_WEEK_SECONDS}; SameSite=Lax`;
}

export function clearAuthCookie(): void {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
