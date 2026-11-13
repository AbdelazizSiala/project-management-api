const jwt = require('jsonwebtoken');

/*Na3mlo verification lel authenticity mt3 el user li b3th el request bech nthbto mel token mt3o s7I7 wele
(ncheckiow ken expired wele mathlan, wel format mt3o s7I7a wele, etc...),
ken kolchy mrgl napproview el request o n3ayto lel next() y3ni lel controller fil 7ala mt3na
(5ater ynjm ybda fama middleware ekher fi cas okhra)*/
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Authentication token is required.'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token.'
        });
    }
};

module.exports = { authenticate };