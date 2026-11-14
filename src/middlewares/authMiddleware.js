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

        //Nextractiw el token, nthabtou menou w n7ottou el info mta3 el user fi req.user bech nesta3mlouhom mba3d
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

/*Na3mlo verification 3la role mt3 el user li b3th el request bech nthbto ken 3andou permission y3ml el action li 7ab y3mlou wele
ex: manager ynjm ychof el projects, el user el 3adi le*/
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'Authentication required.'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'You do not have permission to perform this action.'
            });
        }

        next();
    };
};

module.exports = { authenticate, authorizeRoles };