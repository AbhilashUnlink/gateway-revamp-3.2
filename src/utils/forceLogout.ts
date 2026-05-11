import { store, persistor } from '@/store';
import { showToast } from './toast';

export const SESSION_EXPIRED_ACTION = 'auth/sessionExpired' as const;

let triggered = false;

export function forceLogout(message?: string): void {
  if (triggered) return;
  triggered = true;

  const title = message?.trim() || 'Your session has expired. Please sign in again.';

  showToast.error(title, { id: 'session-expired', duration: 5000 });

  // Reset in-memory Redux state synchronously so any in-flight selectors
  // immediately see a logged-out store.
  store.dispatch({ type: SESSION_EXPIRED_ACTION });

  // Kick off persisted-storage purge in the background — never gate the
  // redirect on it. If purge hangs or rejects, the user would otherwise stay
  // stranded on the authed page after a refresh-token failure.
  void persistor.purge().catch(() => undefined);

  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
}

export function resetForceLogout(): void {
  triggered = false;
}
