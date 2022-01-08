import { render, screen } from '../utils/testing';
import AccountPage from '../pages/account';

describe('Account', () => {
    it('checks for h1', async () => {
        render(<AccountPage />);

        const h1 = screen.getByTestId('h1');
        expect(h1).toHaveTextContent('Account');
    });

    it('checks for content block', async () => {
        render(<AccountPage />);

        const content = screen.getByTestId('content');
        expect(content).toBeInTheDocument();
    });

    it('checks for content block', async () => {
        render(<AccountPage />);

        const content = screen.getByTestId('content');
        expect(content).toBeInTheDocument();
    });

    it('checks for account menus', async () => {
        render(<AccountPage />);

        const content = screen.getAllByTestId('account-menu');
        content.forEach((item) => expect(item).toBeInTheDocument());
    });
});
