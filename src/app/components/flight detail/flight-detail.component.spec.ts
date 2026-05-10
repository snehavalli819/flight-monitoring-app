import { render } from '@testing-library/angular';
import { FlightDetailComponent } from './flight-detail.component';

describe('FlightDetailComponent', () => {
  it('renders when no flight', async () => {
    const { container } = await render(FlightDetailComponent);
    expect(container).toBeTruthy();
  });
});
