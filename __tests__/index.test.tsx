import { render, screen } from '../utils/testing';
import Home from '../pages/index';

describe('Home', () => {
    // HEADER
    it('checks that the nav menu exists', async () => {
        render(<Home />);

        const navbar = screen.getByRole('navigation');

        expect(navbar).toBeVisible();
    });

    it('checks the account menu exists in the navbar functions', async () => {
        render(<Home />);

        const menu = screen.getByRole('menu');
        expect(menu).toBeVisible();

        menu.click();

        const menuItems = screen.getAllByRole('menuitem');
        menuItems.forEach((item) => expect(item).toBeVisible());
    });

    it('checks the cart is visible', async () => {
        render(<Home />);

        const cart = screen.getByTestId('cart');
        expect(cart).toBeVisible();
    });

    it('checks the header logo is visible', async () => {
        render(<Home />);

        const headerLogo = screen.getByTestId('logo');
        expect(headerLogo).toBeVisible();
    });

    it('checks the drawer is rendered', async () => {
        render(<Home />);

        const drawer = screen.getByTestId('drawer');
        expect(drawer).toBeInTheDocument();
    });

    it('checks coin balance is visible', async () => {
        render(<Home />);

        const coins = screen.getAllByText('0 coins');
        coins.forEach((item) => expect(item).toBeInTheDocument());
    });

    // BODY
    it('checks for the welcome header', async () => {
        render(<Home />);

        const heading = screen.getByText('Welcome to King of Cardboard');

        expect(heading).toBeVisible();
    });

    it('checks for the learn more btn', async () => {
        render(<Home />);

        const btn = screen.getByText('Learn More');

        expect(btn).toBeVisible();
    });
});
