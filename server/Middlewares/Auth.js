const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'privatesecret321'); 
        req.userId = decoded.userId;
        req.user = decoded; 
        next();  
    } catch (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
    }
};

module.exports = verifyToken;
