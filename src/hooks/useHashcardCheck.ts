import { useCallback, useState } from 'react';
import { apiService } from '@/utils';
import { showToast } from '@/utils/toast';

interface HashcardCheckResponse {
  statusCode: number;
  message: string;
  messageCode: string;
  success: boolean;
  data: { isExists: boolean };
}

export function useHashcardCheck() {
  const [loading, setLoading] = useState(false);

  const check = useCallback(async (hashCardNumber: string) => {
    if (!hashCardNumber) return;
    try {
      setLoading(true);
      const res = await apiService.hashcard.postCheckHashcard({ hashCardNumber });
      const response = res as { data: HashcardCheckResponse };
      const isWhitelisted = !!response.data?.data?.isExists;
      const message = response.data?.message ?? '';

      if (isWhitelisted) {
        showToast.success(message || 'Hashcard already whitelisted');
      } else {
        showToast.warning(message || 'Hashcard is not whitelisted');
      }
      return isWhitelisted;
    } catch {
      showToast.error('Failed to verify hashcard');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { check, loading };
}
