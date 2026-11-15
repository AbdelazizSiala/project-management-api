
const { body, param, query } = require('express-validator');
const validateRequest = require('../middlewares/validationMiddleware');

const validateCreateProject = [
    body('nom')
        .isString().withMessage('Project name must be a string.')
        .bail()
        .trim()
        .notEmpty().withMessage('Project name is required.'),

    body('description')
        .optional()
        .isString().withMessage('Description must be a string.'),

    body('status')
        .optional()
        .isIn(['in progress', 'completed', 'paused'])
        .withMessage('Invalid project status.'),

    validateRequest
];

const validateUpdateProject = [
    param('id')
        .isMongoId().withMessage('Invalid project ID.'),

    body('nom')
        .optional()
        .isString().withMessage('Project name must be a string.')
        .bail()
        .trim()
        .notEmpty().withMessage('Project name cannot be empty.'),

    body('description')
        .optional()
        .isString().withMessage('Description must be a string.'),

    body('status')
        .optional()
        .isIn(['in progress', 'completed', 'paused'])
        .withMessage('Invalid project status.'),

    //Necheckiow ken el user B3th at least field w7da bech yupdatiha + nthbto ely hya allowed bech ttbadel
    body().custom((value, { req }) => {
        const allowedFields = ['nom', 'description', 'status'];

        if (!allowedFields.some(field => Object.prototype.hasOwnProperty.call(req.body, field))) {
            throw new Error('At least one project field must be provided.');
        }

        return true;
    }),

    validateRequest
];

const validateProjectId = [
    param('id')
        .isMongoId().withMessage('Invalid project ID.'),

    validateRequest
];

const validateGetProjects = [
    query('search')
        .optional()
        .isString().withMessage('Search must be a string.'),

    query('status')
        .optional()
        .isIn(['in progress', 'completed', 'paused'])
        .withMessage('Invalid project status.'),

    query('sortBy')
        .optional()
        .isIn(['nom', 'status', 'createdAt'])
        .withMessage('Invalid sort field.'),

    query('order')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Invalid sort order.'),

    validateRequest
];

module.exports = {
    validateCreateProject,
    validateUpdateProject,
    validateProjectId,
    validateGetProjects
};