// Unit tests for the shared TextInput field (src/components/fields/TextInput.tsx).
//
// This is a thin controlled wrapper around <input type="text">. The tests
// cover the contract callers rely on: render, onChange propagation, and the
// null/undefined-safe value coercion.
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TextInput } from '@/components/fields/TextInput';

describe('TextInput', () => {
  it('renders the value prop into the input', () => {
    render(<TextInput value="hello" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toHaveValue('hello');
  });

  it('shows the placeholder when value is empty', () => {
    render(<TextInput value="" onChange={vi.fn()} placeholder="Enter name" />);
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
  });

  it('calls onChange with the raw string value on user input', () => {
    const onChange = vi.fn();
    render(<TextInput value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new text' } });
    expect(onChange).toHaveBeenCalledWith('new text');
  });

  it('coerces null/undefined value to empty string (no React warning)', () => {
    // Casting via unknown documents the intentional misuse — production code
    // does not pass null but persisted form state has been seen to.
    render(<TextInput value={null as unknown as string} onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });
});
