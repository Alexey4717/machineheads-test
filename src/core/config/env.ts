/** Git Bash on Windows rewrites a CLI `/api` into `C:/Program Files/Git/api`. */
const WINDOWS_GIT_BASH_API = /^[A-Za-z]:[\\/].*[/\\]api$/i;

export function resolveApiBaseUrl(raw: string | undefined): string {
  if (!raw || WINDOWS_GIT_BASH_API.test(raw)) {
    return '/api';
  }

  return raw;
}

export function getApiBaseUrl(): string {
  return resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
}
