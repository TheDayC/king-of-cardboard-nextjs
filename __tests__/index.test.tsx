import { render, screen, waitFor, fireEvent } from '../utils/testing';
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

        const menu = screen.getByTestId('account-dropdown');
        expect(menu).toBeVisible();
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

    // FOOTER
    it('checks the footer logo is visible', async () => {
        render(<Home />);

        const footerLogo = screen.getByTestId('footer-logo');
        expect(footerLogo).toBeVisible();
    });

    it('checks the slogan is visible', async () => {
        render(<Home />);

        const slogan = screen.getByText('Collect, Invest, Share.');
        expect(slogan).toBeVisible();
    });

    it('checks the sub menus are visible', async () => {
        render(<Home />);

        const infoMenu = screen.getByText('Information');
        const customerServiceMenu = screen.getByText('Customer Service');
        const legalMenu = screen.getByText('Legal');

        expect(infoMenu).toBeVisible();
        expect(customerServiceMenu).toBeVisible();
        expect(legalMenu).toBeVisible();
    });

    it('checks social media is visible in the footer', async () => {
        render(<Home />);

        const socialMedia = screen.getByTestId('social-media');

        expect(socialMedia).toBeVisible();
    });
});
