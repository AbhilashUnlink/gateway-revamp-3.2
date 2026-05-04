// Unit tests for the shared MultiSelect field
// (src/components/fields/MultiSelect.tsx).
//
// MultiSelect:
//   - Accepts a string[] value and emits string[] on change (toggle semantics).
//   - Defensively coerces non-array `value` (legacy persisted state) to [].
//   - Renders the first MAX_VISIBLE_TAGS labels in the trigger then "+N more".
//   - Shows a search input only when options.length > SEARCH_THRESHOLD (6).
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MultiSelect } from '@/components/fields/MultiSelect';

const SHORT_OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

const LONG_OPTIONS = Array.from({ length: 8 }, (_, i) => ({
  value: `o${i}`,
  label: `Option ${i}`,
}));

function openMenu() {
  const [trigger] = screen.getAllByRole('button');
  if (!trigger) throw new Error('No trigger button found');
  fireEvent.click(trigger);
}

describe('MultiSelect', () => {
  it('shows placeholder when nothing selected', () => {
    render(
      <MultiSelect value={[]} onChange={vi.fn()} options={SHORT_OPTIONS} placeholder="Pick" />
    );
    expect(screen.getByText('Pick')).toBeInTheDocument();
  });

  it('renders the labels of selected values on the trigger', () => {
    render(<MultiSelect value={['a', 'b']} onChange={vi.fn()} options={SHORT_OPTIONS} />);
    expect(screen.getByText('Alpha, Beta')).toBeInTheDocument();
  });

  it('shows "+N more" when more than the visible-tag limit are selected', () => {
    // MAX_VISIBLE_TAGS is 2 in the component — selecting 3 triggers "+1 more".
    render(<MultiSelect value={['a', 'b', 'c']} onChange={vi.fn()} options={SHORT_OPTIONS} />);
    expect(screen.getByText('+1 more')).toBeInTheDocument();
  });

  it('toggles a value into the selection on click', () => {
    const onChange = vi.fn();
    render(<MultiSelect value={[]} onChange={onChange} options={SHORT_OPTIONS} />);
    openMenu();
    fireEvent.click(screen.getByLabelText('Alpha'));
    expect(onChange).toHaveBeenCalledWith(['a']);
  });

  it('toggles a value out of the selection on click when already selected', () => {
    const onChange = vi.fn();
    render(<MultiSelect value={['a']} onChange={onChange} options={SHORT_OPTIONS} />);
    openMenu();
    fireEvent.click(screen.getByLabelText('Alpha'));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('does not show the search input below the SEARCH_THRESHOLD', () => {
    render(<MultiSelect value={[]} onChange={vi.fn()} options={SHORT_OPTIONS} />);
    openMenu();
    expect(screen.queryByPlaceholderText('Search…')).not.toBeInTheDocument();
  });

  it('shows the search input when option count exceeds the threshold', () => {
    render(<MultiSelect value={[]} onChange={vi.fn()} options={LONG_OPTIONS} />);
    openMenu();
    expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument();
  });

  it('coerces a non-array value to [] without crashing', () => {
    // Legacy persisted state can leave a string here when the field schema
    // changed from `text` to `multiSelect`. The component must not crash.
    render(
      <MultiSelect
        value={'oops' as unknown as string[]}
        onChange={vi.fn()}
        options={SHORT_OPTIONS}
        placeholder="Pick"
      />
    );
    expect(screen.getByText('Pick')).toBeInTheDocument();
  });
});
