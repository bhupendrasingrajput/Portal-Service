export const extractUserMiddleware = (req, res, next) => {
    try {
        const encoded = req.headers['x-user'];
        if (!encoded) return next();

        const userJson = Buffer.from(encoded, 'base64').toString('utf-8');
        req.user = JSON.parse(userJson);

        next();
    } catch (err) {
        console.error('Failed to decode x-user header:', err.message);
        return res.status(400).json({ message: 'Invalid user context' });
    }
};
