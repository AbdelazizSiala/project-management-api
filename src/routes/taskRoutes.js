
const express = require('express');

const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    assignTask
} = require('../controllers/taskController');

const {
    authenticate,
    authorizeRoles
} = require('../middlewares/authMiddleware');

const {
    validateCreateTask,
    validateUpdateTask,
    validateTaskId,
    validateAssignTask,
    validateGetTasks
} = require('../validators/taskValidators');

const router = express.Router();

router.post('/', authenticate, validateCreateTask, createTask);
router.get('/', authenticate, validateGetTasks, getTasks);
router.patch('/:id', authenticate, validateUpdateTask, updateTask);
router.delete('/:id', authenticate, validateTaskId, deleteTask);
router.patch('/:id/assign', authenticate, authorizeRoles('manager'), validateAssignTask, assignTask);

module.exports = router;