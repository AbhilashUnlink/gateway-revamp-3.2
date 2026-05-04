// Integration test for DasForm (src/components/das-form/DasForm.tsx).
//
// DasForm composes react-hook-form + a schema-driven field map. This test
// exercises the full happy-path of:
//   - Rendering an input field from a schema entry.
//   - Wiring the field through `<Controller>` → react-hook-form state.
//   - Submitting the form via the external submit button (form="<id>").
//   - Surfacing validation errors via role="alert" for required fields.
//
// We deliberately use a real form (no rhf mocks) since the value of this test
// is verifying the integration between DasForm, its field map, and rhf.
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DasForm } from '@/components/das-form';
import type { FormSchema } from '@/components/das-form';

// react-i18next is used inside some field components — stub the hook so we
// don't depend on the real i18n bundles during unit tests.
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

function setup(onSubmit: (values: { name: string }) => void) {
  const schema: FormSchema = {
    fields: [
      {
        type: 'input',
        name: 'name',
        label: 'Name',
        placeholder: 'Enter name',
        rules: { required: 'Name is required' },
      },
    ],
  };

  return render(
    <>
      <DasForm id="test-form" schema={schema} defaultValues={{ name: '' }} onSubmit={onSubmit}>
        <DasForm.Fields />
      </DasForm>
      {/* Submit button is intentionally outside the form to mirror how
          drawers render their footer Buttons with `form={FORM_ID}`. */}
      <button type="submit" form="test-form">
        Submit
      </button>
    </>
  );
}

describe('DasForm', () => {
  it('renders the field defined in the schema', () => {
    setup(vi.fn());
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
  });

  it('blocks submit and surfaces a validation error when required field is empty', async () => {
    const onSubmit = vi.fn();
    setup(onSubmit);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // The InputField renders the error in a role="alert" paragraph.
    expect(await screen.findByRole('alert')).toHaveTextContent('Name is required');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the typed value via onSubmit when validation passes', async () => {
    const onSubmit = vi.fn();
    setup(onSubmit);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    // react-hook-form passes (values, event) — assert on values only.
    expect(onSubmit.mock.calls[0]?.[0]).toMatchObject({ name: 'Ada' });
  });
});
