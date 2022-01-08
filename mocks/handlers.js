import { rest } from 'msw';

export const handlers = [
    rest.get('/api/getAccessToken', (req, res, ctx) => {
        return res(
            // Respond with a 200 status code
            ctx.status(200),

            // Send back the token data.
            ctx.json({
                token: 'thisisatesttoken',
                expires: 571,
            })
        );
    }),

    /* rest.get('/user', (req, res, ctx) => {
        // Check if the user is authenticated in this session
        const isAuthenticated = sessionStorage.getItem('is-authenticated')

        if (!isAuthenticated) {
            // If not authenticated, respond with a 403 error
            return res(
                ctx.status(403),
                ctx.json({
                    errorMessage: 'Not authorized',
                })
            )
        }

        // If authenticated, return a mocked user details
        return res(
            ctx.status(200),
            ctx.json({
                username: 'admin',
            })
        )
    }), */
];
