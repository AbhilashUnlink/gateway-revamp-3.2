import type { UserGroup } from '@/types/login/auth.types';

export function getRedirectPath(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _groups: UserGroup[]
): string {
  return '/transactions';
}
