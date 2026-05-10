import { render } from '@testing-library/angular';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  it('renders', async () => {
    const { getByText } = await render(DashboardComponent);
    expect(getByText(/Flights/i)).toBeTruthy();
  });
});
