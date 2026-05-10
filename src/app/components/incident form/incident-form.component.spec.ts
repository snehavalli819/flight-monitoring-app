import { render } from '@testing-library/angular';
import { IncidentFormComponent } from './incident-form.component';

describe('IncidentFormComponent', () => {
  it('renders form', async () => {
    const { getByLabelText } = await render(IncidentFormComponent);
    expect(getByLabelText(/Flight ID/i)).toBeTruthy();
  });
});
