import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ForgotPasswordPage from '@/pages/forgot-password/ForgotPasswordPage';
import useForgotPassword from '@/hooks/forgot-password/useForgotPassword';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@/components/ui/auth-layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/language-select/language-select', () => ({
  default: () => null,
}));

vi.mock('@/hooks/forgot-password/useForgotPassword', () => ({
  default: vi.fn(),
}));

const mockHandleSubmit = vi.fn();

const renderPage = () =>
  render(
    <MemoryRouter>
      <ForgotPasswordPage />
    </MemoryRouter>
  );

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    mockHandleSubmit.mockClear();
    vi.mocked(useForgotPassword).mockReturnValue({
      handleSubmit: mockHandleSubmit,
      error: null,
      loading: false,
    });
  });

  it('renders heading', () => {
    renderPage();
    expect(screen.getByText('forgot_password.heading')).toBeInTheDocument();
  });

  it('renders description', () => {
    renderPage();
    expect(screen.getByText('forgot_password.description')).toBeInTheDocument();
  });

  it('renders back to sign in link', () => {
    renderPage();
    expect(screen.getByText('forgot_password.back_to_sign_in')).toBeInTheDocument();
  });

  it('renders email input', () => {
    renderPage();
    expect(
      screen.getByPlaceholderText('forgot_password_form.email_placeholder')
    ).toBeInTheDocument();
  });

  it('shows email required error on empty submit', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: 'forgot_password_form.submit' }));
    await waitFor(() => {
      expect(screen.getByText('forgot_password_form.email_required')).toBeInTheDocument();
    });
  });

  it('shows email invalid error for malformed email', async () => {
    renderPage();
    await userEvent.type(
      screen.getByPlaceholderText('forgot_password_form.email_placeholder'),
      'notvalid'
    );
    await userEvent.click(screen.getByRole('button', { name: 'forgot_password_form.submit' }));
    await waitFor(() => {
      expect(screen.getByText('forgot_password_form.email_invalid')).toBeInTheDocument();
    });
  });

  it('calls handleSubmit with valid email', async () => {
    renderPage();
    await userEvent.type(
      screen.getByPlaceholderText('forgot_password_form.email_placeholder'),
      'user@example.com'
    );
    await userEvent.click(screen.getByRole('button', { name: 'forgot_password_form.submit' }));
    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalledWith(
        { username: 'user@example.com' },
        expect.anything()
      );
    });
  });

  it('shows API error message', () => {
    vi.mocked(useForgotPassword).mockReturnValue({
      handleSubmit: mockHandleSubmit,
      error: 'Something went wrong',
      loading: false,
    });
    renderPage();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('shows submitting text and disables button while loading', () => {
    vi.mocked(useForgotPassword).mockReturnValue({
      handleSubmit: mockHandleSubmit,
      error: null,
      loading: true,
    });
    renderPage();
    const btn = screen.getByRole('button', { name: 'forgot_password_form.submitting' });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });
});
