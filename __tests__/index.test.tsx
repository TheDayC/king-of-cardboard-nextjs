import { render, screen } from '../utils/testing';
import Home from '../pages/index';

describe('Home', () => {
    it('renders a heading', () => {
        render(<Home />);

        /* const heading = screen.getByRole('heading', {
            name: ,
        }); */
        const heading = screen.getByText('Welcome to King of Cardboard');

        expect(heading).toBeInTheDocument();
    });
});
