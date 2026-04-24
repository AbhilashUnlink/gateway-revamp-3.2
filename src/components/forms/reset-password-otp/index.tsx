import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface ResetPasswordOtpFormProps {
  onSubmit: (otp: string) => void;
  onResend: () => void;
  error?: string | null;
}

export function ResetPasswordOtpForm({ onSubmit, onResend, error }: ResetPasswordOtpFormProps) {
  const { t } = useTranslation();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const refs = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null, null]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...digits];
    next[i] = val.slice(-1);
    setDigits(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !(digits[i] ?? '') && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...pasted.split(''), ...Array(6).fill('')].slice(0, 6) as string[];
    setDigits(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < 6) return;
    onSubmit(otp);
  };

  const isComplete = digits.every((d) => d !== '');

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[40px]">
      {/* 6 OTP digit boxes */}
      <div className="grid w-full grid-cols-6 gap-[14px]">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit ?? ''}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            style={{ fontFamily: 'Inter, sans-serif' }}
            className="h-[63px] w-full rounded-[8px] border border-[#e5e5e5] bg-white text-center text-[24px] font-semibold text-[#1a1a1a] outline-none focus:ring-2 focus:ring-[#f7941d]/40"
          />
        ))}
      </div>

      {error ? <p className="text-center text-[14px] text-red-400">{error}</p> : null}

      <Button type="submit" disabled={!isComplete} variant={'primary'} size={'default'}>
        {t('reset_password_otp.submit')}
      </Button>

      {/* Resend */}
      <div className="flex items-center justify-center">
        <p className="text-[14px] text-[#ccc]" style={{ fontFamily: 'Inter, sans-serif' }}>
          <span className="mr-[4px]">{t('reset_password_otp.didnt_receive')}</span>{' '}
          <Button
            type="button"
            variant={'link'}
            onClick={onResend}
            className="font-semibold text-[#f7941d] underline underline-offset-2"
          >
            {t('reset_password_otp.resend_otp')}
          </Button>
        </p>
      </div>
    </form>
  );
}
