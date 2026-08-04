// Author / general-user auth — separate from admin auth (different storage keys).
const TOKEN_KEY = 'user_token';
const USER_KEY = 'user_user';
// Cookie read by proxy.ts to let logged-in users through the coming-soon gate
const PREVIEW_COOKIE = 'aml_user_preview';

export interface AuthUser {
  name: string;
  email: string;
  roles: string[];
}

export const API_BASE =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  'http://127.0.0.1:8000/api';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAuth(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // 30 days; lets the coming-soon gate recognise this browser as a logged-in user
  document.cookie = `${PREVIEW_COOKIE}=1; path=/; max-age=2592000; samesite=lax`;
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = `${PREVIEW_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Fetch with the author token attached; redirects to login on 401. */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers ?? {}) },
  });

  if (res.status === 401) {
    clearAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/account/login';
    }
  }

  return res;
}
