// Add this temporary route to check user details
router.get('/test-user/:userId', async (req, res) => {
    try {
        const { User } = await import('../models/user.model.js');
        const user = await User.findById(req.params.userId);
        res.json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                userType: user.userType,
                isActive: user.isActive,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { router };