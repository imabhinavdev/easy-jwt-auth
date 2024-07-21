
export const signout = (req, res) => {
    res.clearCookie('accessToken'); // Adjust the cookie name if needed
    res.clearCookie('refreshToken'); // Adjust the cookie name if needed


    res.status(200).json({ message: 'Signed out successfully' });
};
