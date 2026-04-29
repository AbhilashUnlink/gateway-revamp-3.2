import { store, persistor } from '@/store';
import { showToast } from './toast';

export const SESSION_EXPIRED_ACTION = 'auth/sessionExpired' as const;

let triggered = false;

export function forceLogout(message?: string): void {
  if (triggered) return;
  triggered = true;

  const title = message?.trim() || 'Your session has expired. Please sign in again.';

  showToast.error(title, { id: 'session-expired', duration: 5000 });

  store.dispatch({ type: SESSION_EXPIRED_ACTION });

  void persistor.purge().finally(() => {
    if (window.location.pathname !== '/login') {
      window.location.replace('/login');
    }
  });
}

export function resetForceLogout(): void {
  triggered = false;
}
