import { render } from '@testing-library/angular';
import { FlightsListComponent } from './flights-list.component';

describe('FlightsListComponent', () => {
  it('renders table', async () => {
    const { container } = await render(FlightsListComponent);
    expect(container.querySelector('table')).toBeTruthy();
  });
});
