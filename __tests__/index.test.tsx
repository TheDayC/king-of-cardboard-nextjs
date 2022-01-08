import { render, screen } from '../utils/testing';
import Home from '../pages';

describe('Home', () => {
    it('renders a heading', () => {
        render(<Home />);

        const heading = screen.getByRole('heading', {
            name: /welcome to next\.js!/i,
        });

        expect(heading).toBeInTheDocument();
    });
});
