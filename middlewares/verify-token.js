const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    req.user = null;

    if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'Brak klucza JWT.' });

    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(); 
    }

    const jwtToken = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(jwtToken, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: 'Nieprawidłowy token..' });
    }

    next();
};
