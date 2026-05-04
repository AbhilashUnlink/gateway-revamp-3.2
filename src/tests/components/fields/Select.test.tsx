// Unit / component tests for the shared Select field
// (src/components/fields/Select.tsx).
//
// Select is a custom dropdown that:
//   - Renders a trigger button showing the selected option's label.
//   - Opens a portaled menu with optional case-insensitive search.
//   - Greys out option values listed in `disabledValues`.
//
// Notes:
//   - The menu uses createPortal into document.body — RTL still finds it
//     because we query from `screen` which scopes to the whole DOM.
//   - We don't assert on portal positioning (top/left/width) — those are
//     layout side effects we don't want to lock in.
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Select } from '@/components/fields/Select';

const OPTIONS = [
  { value: 'usd', label: 'US Dollar' },
  { value: 'eur', label: 'Euro' },
  { value: 'jpy', label: 'Japanese Yen' },
];

function open() {
  // The trigger is the only button on the screen until the menu opens.
  fireEvent.click(screen.getAllByRole('button')[0]);
}

describe('Select', () => {
  it('shows placeholder when no value is selected', () => {
    render(<Select value="" onChange={vi.fn()} options={OPTIONS} placeholder="Pick currency" />);
    expect(screen.getByText('Pick currency')).toBeInTheDocument();
  });

  it('shows the selected option label on the trigger', () => {
    render(<Select value="eur" onChange={vi.fn()} options={OPTIONS} />);
    expect(screen.getByText('Euro')).toBeInTheDocument();
  });

  it('opens the menu and lists every option on trigger click', () => {
    render(<Select value="" onChange={vi.fn()} options={OPTIONS} />);
    open();
    for (const opt of OPTIONS) {
      expect(screen.getByText(opt.label)).toBeInTheDocument();
    }
  });

  it('filters options case-insensitively as the user types in search', () => {
    render(<Select value="" onChange={vi.fn()} options={OPTIONS} />);
    open();
    fireEvent.change(screen.getByPlaceholderText('Search…'), { target: { value: 'YEN' } });
    expect(screen.getByText('Japanese Yen')).toBeInTheDocument();
    expect(screen.queryByText('Euro')).not.toBeInTheDocument();
  });

  it('shows "No matches" when query has no hits but options exist', () => {
    render(<Select value="" onChange={vi.fn()} options={OPTIONS} />);
    open();
    fireEvent.change(screen.getByPlaceholderText('Search…'), { target: { value: 'zzz' } });
    expect(screen.getByText('No matches')).toBeInTheDocument();
  });

  it('shows "No options" when the option list is empty', () => {
    render(<Select value="" onChange={vi.fn()} options={[]} />);
    open();
    expect(screen.getByText('No options')).toBeInTheDocument();
  });

  it('calls onChange with the option value when a row is clicked', () => {
    const onChange = vi.fn();
    render(<Select value="" onChange={onChange} options={OPTIONS} />);
    open();
    fireEvent.click(screen.getByText('Euro'));
    expect(onChange).toHaveBeenCalledWith('eur');
  });

  it('does not call onChange when a disabled value is clicked', () => {
    const onChange = vi.fn();
    render(<Select value="" onChange={onChange} options={OPTIONS} disabledValues={['eur']} />);
    open();
    // The disabled <button> is non-clickable — fireEvent.click on a disabled
    // button is a no-op, so onChange must remain uncalled.
    fireEvent.click(screen.getByText('Euro'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
