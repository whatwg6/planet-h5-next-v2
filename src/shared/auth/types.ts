export interface AuthSession {
  accessToken: string;
  expiresAt?: number;
  userId: string;
}

export interface AuthAdapter {
  clearSession(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
}

export type Permission = string;

export function hasPermission(granted: readonly Permission[], required: Permission): boolean {
  return granted.includes(required);
}
