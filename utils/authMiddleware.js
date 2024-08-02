import jwt from 'jsonwebtoken';

// utils/authMiddleware.js
export const authMiddleware = ({ secret, except = [], algorithms = ["HS256"] }) => {
    return (req, res, next) => {
        // Log request path for debugging
        console.log(`Request Path: ${req.path}`);

        // Check if the request path matches any pattern in the except array
        const isExcluded = except.some(pattern => pathMatches(req.path, pattern));
        console.log(`Is Excluded: ${isExcluded}`); // Log if the path is excluded

        if (isExcluded) {
            return next(); // Skip authentication for excluded routes
        }

        // Extract token from headers
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, secret, { algorithms });
            req.user = decoded; // Attach user data to request
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    };
};

const pathMatches = (path, pattern) => {
    const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
    return regex.test(path);
};
