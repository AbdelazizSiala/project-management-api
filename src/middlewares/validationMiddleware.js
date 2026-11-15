
const { validationResult } = require('express-validator');

/*Honi ncheckiow ken fama ay error fil requests mt3 el corresponding validators mt3 el route,
ken fama error nreje3ou 400 status code m3a el details mt3 el errors.
Nesta3Mlo middleware bech man93odsh n3mlo fil checks hdhom fi kol validator*/
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed.',
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg
            }))
        });
    }

    next();
};

module.exports = validateRequest;