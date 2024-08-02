import jwt from 'jsonwebtoken';
import minimatch from 'minimatch';

// utils/authMiddleware.js
export const authMiddleware = ({ secret, except = [], algorithms = ["HS256"] }) => {
    return (req, res, next) => {
        // Check if the request path matches any pattern in the except array
        const isExcluded = except.some(pattern => minimatch(req.path, pattern));
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
