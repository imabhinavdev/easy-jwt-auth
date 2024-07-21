
import jwt from 'jsonwebtoken';

export const refreshToken = (secret) => {
    return (req, res) => {
        // Extract the refresh token from cookies or headers
        const refreshToken = req.cookies?.refreshToken || req.headers['authorization']?.split(' ')[1];

        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        try {
            // Verify the refresh token
            const decoded = jwt.verify(refreshToken, secret);

            // Generate a new access token
            const newAccessToken = jwt.sign({ id: decoded.id, email: decoded.email }, secret, { expiresIn: '1h' });

            res.status(200).json({ accessToken: newAccessToken });
        } catch (error) {
            res.status(401).json({ message: 'Invalid refresh token' });
        }
    };
};
