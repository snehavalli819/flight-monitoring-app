import { render } from '@testing-library/angular';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  it('shows welcome', async () => {
    const { getByText } = await render(HomeComponent);
    expect(getByText(/Welcome to Flight Monitor/i)).toBeTruthy();
  });
});
