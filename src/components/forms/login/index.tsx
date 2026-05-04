import { useTranslation } from 'react-i18next';
import { DasForm } from '@/components/das-form';
import { getLoginSchema } from './constants';
import type { LoginFormValues } from '@/types/login/auth.types';

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  loading?: boolean;
}

export function LoginForm({ onSubmit, loading }: LoginFormProps) {
  const { t } = useTranslation();
  const schema = getLoginSchema(t);

  return (
    <DasForm<LoginFormValues> schema={schema} onSubmit={onSubmit} loading={loading}>
      <DasForm.Fields />
      <DasForm.Actions />
    </DasForm>
  );
}
