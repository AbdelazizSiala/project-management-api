
const express = require('express');
const {
    createProject,
    getProjects,
    updateProject,
    deleteProject
} = require('../controllers/projectController');

const { authenticate } = require('../middlewares/authMiddleware');

const {
    validateCreateProject,
    validateUpdateProject,
    validateProjectId,
    validateGetProjects
} = require('../validators/projectValidators');

const router = express.Router();

router.post('/', authenticate, validateCreateProject, createProject);
router.get('/', authenticate, validateGetProjects, getProjects);
router.patch('/:id', authenticate, validateUpdateProject, updateProject);
router.delete('/:id', authenticate, validateProjectId, deleteProject);

module.exports = router;