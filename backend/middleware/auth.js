const admin = require('../config/firebase');

const verifyAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // { uid, email, ... }
        next();
    } catch (error) {
        res.status(403).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = verifyAuth;
