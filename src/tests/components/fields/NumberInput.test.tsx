// Unit tests for the shared NumberInput field
// (src/components/fields/NumberInput.tsx).
//
// NumberInput accepts string | number from callers but always emits string
// from onChange (since the underlying <input type="number"> reports e.target.value).
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NumberInput } from '@/components/fields/NumberInput';

describe('NumberInput', () => {
  it('renders a number input', () => {
    render(<NumberInput value={42} onChange={vi.fn()} />);
    // type=number — RTL exposes it as spinbutton role, not textbox.
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('renders the numeric value', () => {
    render(<NumberInput value={42} onChange={vi.fn()} />);
    expect(screen.getByRole('spinbutton')).toHaveValue(42);
  });

  it('emits a string value via onChange when the user types', () => {
    const onChange = vi.fn();
    render(<NumberInput value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '123' } });
    // onChange always emits string — this is a deliberate part of the API
    // (callers parseFloat at the form layer).
    expect(onChange).toHaveBeenCalledWith('123');
  });

  it('falls back to empty string when value is null/undefined', () => {
    render(<NumberInput value={null as unknown as string} onChange={vi.fn()} />);
    expect(screen.getByRole('spinbutton')).toHaveValue(null);
  });
});
