
const { body } = require('express-validator');
const validateRequest = require('../middlewares/validationMiddleware');

const validateRegister = [
    body('nom')
        .isString().withMessage('Name must be a string.')
        .bail()
        .trim()
        .notEmpty().withMessage('Name is required.'),

    body('login')
        .isString().withMessage('Login must be a string.')
        .bail()
        .trim()
        .notEmpty().withMessage('Login is required.'),

    body('password')
        .isString().withMessage('Password must be a string.')
        .bail()
        .notEmpty().withMessage('Password is required.'),

    validateRequest
];

const validateLogin = [
    body('login')
        .isString().withMessage('Login must be a string.')
        .bail()
        .trim()
        .notEmpty().withMessage('Login is required.'),

    body('password')
        .isString().withMessage('Password must be a string.')
        .bail()
        .notEmpty().withMessage('Password is required.'),

    validateRequest
];

module.exports = { validateRegister, validateLogin };