import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResetPasswordPage from '@/pages/reset-password/ResetPasswordPage';
import useResetPassword from '@/hooks/reset-password/useResetPassword';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@/components/ui/auth-layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/language-select/language-select', () => ({
  default: () => null,
}));

vi.mock('@/hooks/reset-password/useResetPassword', () => ({
  default: vi.fn(),
}));

const mockHandleOtpSubmit = vi.fn();
const mockHandleResendOtp = vi.fn();
const mockHandlePasswordSubmit = vi.fn();

const otpStepValues = {
  step: 'otp' as const,
  handleOtpSubmit: mockHandleOtpSubmit,
  handleResendOtp: mockHandleResendOtp,
  handlePasswordSubmit: mockHandlePasswordSubmit,
  loading: false,
  error: null,
};

const passwordStepValues = { ...otpStepValues, step: 'password' as const };

// A password that meets all requirements: ≥14 chars, upper + lower + digit + special
const VALID_PASSWORD = 'ValidPass1!@#Test';

const renderPage = () =>
  render(
    <MemoryRouter>
      <ResetPasswordPage />
    </MemoryRouter>
  );

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    mockHandleOtpSubmit.mockClear();
    mockHandleResendOtp.mockClear();
    mockHandlePasswordSubmit.mockClear();
    vi.mocked(useResetPassword).mockReturnValue(otpStepValues);
  });

  // ─── OTP step ────────────────────────────────────────────────────────────

  describe('OTP step', () => {
    it('renders OTP heading', () => {
      renderPage();
      expect(screen.getByText('reset_password_otp.heading')).toBeInTheDocument();
    });

    it('renders OTP description', () => {
      renderPage();
      expect(screen.getByText('reset_password_otp.description')).toBeInTheDocument();
    });

    it('renders 6 OTP input boxes', () => {
      renderPage();
      expect(screen.getAllByRole('textbox')).toHaveLength(6);
    });

    it('submit button is disabled when OTP is incomplete', () => {
      renderPage();
      expect(screen.getByRole('button', { name: 'reset_password_otp.submit' })).toBeDisabled();
    });

    it('submit button is enabled when all 6 digits are filled', async () => {
      renderPage();
      const inputs = screen.getAllByRole('textbox');
      for (const input of inputs) {
        await userEvent.type(input, '1');
      }
      expect(screen.getByRole('button', { name: 'reset_password_otp.submit' })).not.toBeDisabled();
    });

    it('auto-advances focus to next input on digit entry', async () => {
      renderPage();
      const inputs = screen.getAllByRole('textbox');
      await userEvent.type(inputs?.[0] as Element, '5');
      await waitFor(() => {
        expect(document.activeElement).toBe(inputs[1]);
      });
    });

    it('moves focus to previous input on Backspace when current input is empty', async () => {
      renderPage();
      const inputs = screen.getAllByRole('textbox');
      // Type a digit into index 1, then clear it and press Backspace
      await userEvent.type(inputs?.[1] as Element, '3');
      await userEvent.clear(inputs?.[1] as Element);
      inputs?.[1]?.focus();
      await userEvent.keyboard('{Backspace}');
      await waitFor(() => {
        expect(document.activeElement).toBe(inputs[0]);
      });
    });

    it('fills all 6 digits on paste', async () => {
      renderPage();
      const inputs = screen.getAllByRole('textbox');
      fireEvent.paste(inputs?.[0] as Element, {
        clipboardData: { getData: () => '123456' },
      });
      await waitFor(() => {
        expect((inputs[0] as HTMLInputElement).value).toBe('1');
        expect((inputs[5] as HTMLInputElement).value).toBe('6');
      });
    });

    it('calls handleOtpSubmit with the entered OTP value', async () => {
      renderPage();
      const inputs = screen.getAllByRole('textbox');
      for (let i = 0; i < 6; i++) {
        await userEvent.type(inputs?.[i] as Element, String(i + 1));
      }
      await userEvent.click(screen.getByRole('button', { name: 'reset_password_otp.submit' }));
      await waitFor(() => {
        expect(mockHandleOtpSubmit).toHaveBeenCalledWith('123456');
      });
    });

    it('calls handleResendOtp when resend button is clicked', async () => {
      renderPage();
      await userEvent.click(screen.getByRole('button', { name: 'reset_password_otp.resend_otp' }));
      expect(mockHandleResendOtp).toHaveBeenCalled();
    });

    it('shows error message in OTP step', () => {
      vi.mocked(useResetPassword).mockReturnValue({ ...otpStepValues, error: 'Invalid OTP' });
      renderPage();
      expect(screen.getByText('Invalid OTP')).toBeInTheDocument();
    });
  });

  // ─── Password step ────────────────────────────────────────────────────────

  describe('password step', () => {
    beforeEach(() => {
      vi.mocked(useResetPassword).mockReturnValue(passwordStepValues);
    });

    it('renders reset password heading', () => {
      renderPage();
      expect(screen.getByText('reset_password.heading')).toBeInTheDocument();
    });

    it('renders new password input', () => {
      renderPage();
      expect(
        screen.getByPlaceholderText('reset_password_form.new_password_placeholder')
      ).toBeInTheDocument();
    });

    it('renders confirm password input', () => {
      renderPage();
      expect(
        screen.getByPlaceholderText('reset_password_form.confirm_password_placeholder')
      ).toBeInTheDocument();
    });

    it('shows password too short error for < 14 chars', async () => {
      renderPage();
      await userEvent.type(
        screen.getByPlaceholderText('reset_password_form.new_password_placeholder'),
        'Short1!'
      );
      await userEvent.type(
        screen.getByPlaceholderText('reset_password_form.confirm_password_placeholder'),
        'Short1!'
      );
      await userEvent.click(screen.getByRole('button', { name: 'reset_password_form.submit' }));
      await waitFor(() => {
        expect(screen.getByText('reset_password_form.password_too_short')).toBeInTheDocument();
      });
    });

    it('shows passwords must match error when confirm differs', async () => {
      renderPage();
      await userEvent.type(
        screen.getByPlaceholderText('reset_password_form.new_password_placeholder'),
        VALID_PASSWORD
      );
      await userEvent.type(
        screen.getByPlaceholderText('reset_password_form.confirm_password_placeholder'),
        'DifferentPass1!@'
      );
      await userEvent.click(screen.getByRole('button', { name: 'reset_password_form.submit' }));
      await waitFor(() => {
        expect(screen.getByText('reset_password_form.passwords_must_match')).toBeInTheDocument();
      });
    });

    it('calls handlePasswordSubmit with valid matching passwords', async () => {
      renderPage();
      await userEvent.type(
        screen.getByPlaceholderText('reset_password_form.new_password_placeholder'),
        VALID_PASSWORD
      );
      await userEvent.type(
        screen.getByPlaceholderText('reset_password_form.confirm_password_placeholder'),
        VALID_PASSWORD
      );
      await userEvent.click(screen.getByRole('button', { name: 'reset_password_form.submit' }));
      await waitFor(() => {
        expect(mockHandlePasswordSubmit).toHaveBeenCalledWith(
          { Password: VALID_PASSWORD, ConfirmPassword: VALID_PASSWORD },
          expect.anything()
        );
      });
    });

    it('shows API error message in password step', () => {
      vi.mocked(useResetPassword).mockReturnValue({
        ...passwordStepValues,
        error: 'Reset failed',
      });
      renderPage();
      expect(screen.getByText('Reset failed')).toBeInTheDocument();
    });

    it('shows submitting text and disables button while loading', () => {
      vi.mocked(useResetPassword).mockReturnValue({ ...passwordStepValues, loading: true });
      renderPage();
      const btn = screen.getByRole('button', { name: 'reset_password_form.submitting' });
      expect(btn).toBeInTheDocument();
      expect(btn).toBeDisabled();
    });
  });
});
