import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '@/pages/login/LoginPage';
import useLogin from '@/hooks/login/useLogin';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@/components/ui/auth-layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/language-select/language-select', () => ({
  default: () => null,
}));

vi.mock('@/hooks/login/useLogin', () => ({
  default: vi.fn(),
}));

const mockHandleSubmit = vi.fn();

const renderPage = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

describe('LoginPage', () => {
  beforeEach(() => {
    mockHandleSubmit.mockClear();
    vi.mocked(useLogin).mockReturnValue({
      handleSubmit: mockHandleSubmit,
      loading: false,
    });
  });

  it('renders sign in heading', () => {
    renderPage();
    expect(screen.getByText('login.sign_in_to')).toBeInTheDocument();
  });

  it('renders email input', () => {
    renderPage();
    expect(screen.getByPlaceholderText('login_form.email_placeholder')).toBeInTheDocument();
  });

  it('renders password input', () => {
    renderPage();
    expect(screen.getByPlaceholderText('login_form.password_placeholder')).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    renderPage();
    expect(screen.getByText('login.forgot_password')).toBeInTheDocument();
  });

  it('renders create an account link', () => {
    renderPage();
    expect(screen.getByText('login.create_an_account')).toBeInTheDocument();
  });

  it('shows email required error on empty form submit', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: 'login_form.submit' }));
    await waitFor(() => {
      expect(screen.getByText('login_form.email_required')).toBeInTheDocument();
    });
  });

  it('shows email invalid error for malformed email', async () => {
    renderPage();
    await userEvent.type(screen.getByPlaceholderText('login_form.email_placeholder'), 'notanemail');
    await userEvent.click(screen.getByRole('button', { name: 'login_form.submit' }));
    await waitFor(() => {
      expect(screen.getByText('login_form.email_invalid')).toBeInTheDocument();
    });
  });

  it('shows password required error when only email is filled', async () => {
    renderPage();
    await userEvent.type(
      screen.getByPlaceholderText('login_form.email_placeholder'),
      'user@example.com'
    );
    await userEvent.click(screen.getByRole('button', { name: 'login_form.submit' }));
    await waitFor(() => {
      expect(screen.getByText('login_form.password_required')).toBeInTheDocument();
    });
  });

  it('calls handleSubmit with valid credentials', async () => {
    renderPage();
    await userEvent.type(
      screen.getByPlaceholderText('login_form.email_placeholder'),
      'user@example.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText('login_form.password_placeholder'),
      'Password1!'
    );
    await userEvent.click(screen.getByRole('button', { name: 'login_form.submit' }));
    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalledWith(
        { username: 'user@example.com', password: 'Password1!' },
        expect.anything()
      );
    });
  });

  it('shows submitting text while loading', () => {
    vi.mocked(useLogin).mockReturnValue({
      handleSubmit: mockHandleSubmit,
      loading: true,
    });
    renderPage();
    expect(screen.getByRole('button', { name: 'login_form.submitting' })).toBeInTheDocument();
  });

  it('disables submit button while loading', () => {
    vi.mocked(useLogin).mockReturnValue({
      handleSubmit: mockHandleSubmit,
      loading: true,
    });
    renderPage();
    expect(screen.getByRole('button', { name: 'login_form.submitting' })).toBeDisabled();
  });

  it('toggles password visibility on button click', async () => {
    renderPage();
    const passwordInput = screen.getByPlaceholderText('login_form.password_placeholder');
    expect(passwordInput).toHaveAttribute('type', 'password');

    await userEvent.click(screen.getByRole('button', { name: 'login_form.show_password' }));
    expect(passwordInput).toHaveAttribute('type', 'text');

    await userEvent.click(screen.getByRole('button', { name: 'login_form.hide_password' }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
