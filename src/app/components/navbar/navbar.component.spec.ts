import { render } from '@testing-library/angular';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  it('renders brand', async () => {
    const { getByText } = await render(NavbarComponent);
    expect(getByText(/Flight Monitor/i)).toBeTruthy();
  });
});
