import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '@/App';

vi.mock('@/store/hooks', () => ({
  useAppSelector: () => 'en',
  useAppDispatch: () => vi.fn(),
}));

vi.mock('@/i18n', () => ({
  default: { changeLanguage: vi.fn() },
}));

vi.mock('@/router/AppRouter', () => ({
  AppRouter: () => <div data-testid="app-router" />,
}));

describe('App', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('app-router')).toBeInTheDocument();
  });
});
