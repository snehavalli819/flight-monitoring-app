import { render } from '@testing-library/angular';
import { MapComponent } from './flight-map.component';

describe('MapComponent', () => {
  it('renders container', async () => {
    const { container } = await render(MapComponent);
    expect(container.querySelector('.map')).toBeTruthy();
  });
});
