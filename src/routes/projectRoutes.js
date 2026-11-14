const express = require('express');
const { createProject, getProjects, updateProject, deleteProject } = require('../controllers/projectController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createProject);
router.get('/', authenticate, getProjects);
router.patch('/:id', authenticate, updateProject);
router.delete('/:id', authenticate, deleteProject);

module.exports = router;