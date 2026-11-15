
const { body, param, query } = require('express-validator');
const validateRequest = require('../middlewares/validationMiddleware');

const validateCreateTask = [
    body('title')
        .isString().withMessage('Task title must be a string.')
        .bail()
        .trim()
        .notEmpty().withMessage('Task title is required.'),

    body('description')
        .optional()
        .isString().withMessage('Description must be a string.'),

    body('status')
        .optional()
        .isIn(['todo', 'doing', 'done'])
        .withMessage('Invalid task status.'),

    body('deadline')
        .isISO8601().withMessage('A valid deadline is required.'),

    body('project')
        .isMongoId().withMessage('A valid project ID is required.'),

    validateRequest
];

const validateUpdateTask = [
    param('id')
        .isMongoId().withMessage('Invalid task ID.'),

    body('title')
        .optional()
        .isString().withMessage('Task title must be a string.')
        .bail()
        .trim()
        .notEmpty().withMessage('Task title cannot be empty.'),

    body('description')
        .optional()
        .isString().withMessage('Description must be a string.'),

    body('status')
        .optional()
        .isIn(['todo', 'doing', 'done'])
        .withMessage('Invalid task status.'),

    body('deadline')
        .optional()
        .isISO8601().withMessage('Invalid deadline.'),

    //Necheckiow ken el user B3th at least field w7da bech yupdatiha + nthbto ely hya allowed bech ttbadel
    body().custom((value, { req }) => {
        const allowedFields = ['title', 'description', 'status', 'deadline'];

        if (!allowedFields.some(field => Object.prototype.hasOwnProperty.call(req.body, field))) {
            throw new Error('At least one task field must be provided.');
        }

        return true;
    }),

    validateRequest
];

const validateTaskId = [
    param('id')
        .isMongoId().withMessage('Invalid task ID.'),

    validateRequest
];

const validateAssignTask = [
    param('id')
        .isMongoId().withMessage('Invalid task ID.'),

    body('assignedTo')
        .isMongoId().withMessage('A valid user ID is required.'),

    validateRequest
];

const validateGetTasks = [
    query('search')
        .optional()
        .isString().withMessage('Search must be a string.'),

    query('status')
        .optional()
        .isIn(['todo', 'doing', 'done'])
        .withMessage('Invalid task status.'),

    query('project')
        .optional()
        .isMongoId().withMessage('Invalid project ID.'),

    query('assignedTo')
        .optional()
        .isMongoId().withMessage('Invalid user ID.'),

    query('deadlineFrom')
        .optional()
        .isISO8601().withMessage('Invalid start deadline date.'),

    query('deadlineTo')
        .optional()
        .isISO8601().withMessage('Invalid end deadline date.'),

    query('sortBy')
        .optional()
        .isIn(['title', 'status', 'deadline', 'createdAt'])
        .withMessage('Invalid sort field.'),

    query('order')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Invalid sort order.'),

    validateRequest
];

module.exports = {
    validateCreateTask,
    validateUpdateTask,
    validateTaskId,
    validateAssignTask,
    validateGetTasks
};