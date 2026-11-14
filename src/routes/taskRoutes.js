
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

const router = express.Router();

router.post('/', authenticate, createTask);
router.get('/', authenticate, getTasks);
router.patch('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);
router.patch('/:id/assign', authenticate, authorizeRoles('manager'), assignTask);

module.exports = router;