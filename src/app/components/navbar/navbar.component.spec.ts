import { render } from '@testing-library/angular';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
    it('renders brand', async () => {
        const { getByText } = await render(NavbarComponent);
        expect(getByText(/Flight Monitor/i)).toBeTruthy();
    });

    it('has expected default signals/state', async () => {
        const { fixture } = await render(NavbarComponent);
        const comp = fixture.componentInstance as NavbarComponent;

        expect(comp.sidebarOpened()).toBeTrue();
        expect(comp.alertCount()).toBe(12);
        expect(comp.currentRole()).toBe('Supervisor');
        expect(Array.isArray(comp.navItems)).toBeTrue();
        expect(comp.navItems.length).toBeGreaterThan(0);
    });

    it('toggles sidebar when toggleSidebar is called', async () => {
        const { fixture } = await render(NavbarComponent);
        const comp = fixture.componentInstance as NavbarComponent;

        const before = comp.sidebarOpened();
        comp.toggleSidebar();
        const after = comp.sidebarOpened();
        expect(after).toBe(!before);
    });

    it('trackByLabel returns the item label', async () => {
        const { fixture } = await render(NavbarComponent);
        const comp = fixture.componentInstance as NavbarComponent;

        const item = comp.navItems[1];
        const tracked = comp.trackByLabel(1, item);
        expect(tracked).toBe(item.label);
    });

    it('renders main navigation labels in the template', async () => {
        const { getByText } = await render(NavbarComponent);

        // check a few representative items; adjust if template text differs
        expect(getByText(/Dashboard/i)).toBeTruthy();
        expect(getByText(/Flights/i)).toBeTruthy();
        expect(getByText(/Live Tracking/i)).toBeTruthy();
    });
});
